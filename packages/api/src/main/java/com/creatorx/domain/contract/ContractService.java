package com.creatorx.domain.contract;

import com.creatorx.domain.application.Application;
import com.creatorx.domain.application.ApplicationRepository;
import com.creatorx.domain.brand.Brand;
import com.creatorx.domain.brand.BrandRepository;
import com.creatorx.domain.campaign.Campaign;
import com.creatorx.domain.campaign.CampaignRepository;
import com.creatorx.domain.contract.dto.ContractResponse;
import com.creatorx.domain.contract.dto.SignContractRequest;
import com.creatorx.domain.creator.CreatorProfile;
import com.creatorx.domain.creator.CreatorProfileRepository;
import com.creatorx.domain.deliverable.Deliverable;
import com.creatorx.domain.deliverable.DeliverableRepository;
import com.creatorx.domain.notification.Notification;
import com.creatorx.domain.notification.NotificationService;
import com.creatorx.domain.payment.Transaction;
import com.creatorx.domain.payment.TransactionRepository;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ContractService {

    private final DigitalContractRepository contractRepository;
    private final CampaignRepository campaignRepository;
    private final ApplicationRepository applicationRepository;
    private final DeliverableRepository deliverableRepository;
    private final CreatorProfileRepository creatorProfileRepository;
    private final BrandRepository brandRepository;
    private final TransactionRepository transactionRepository;
    private final NotificationService notificationService;
    private final ContractMapper contractMapper;

    @Transactional(readOnly = true)
    public ContractResponse getByCampaign(UUID requesterId, UUID campaignId) {
        DigitalContract contract = contractRepository.findByCampaignId(campaignId)
            .orElseThrow(() -> new EntityNotFoundException("Contract not found"));
        Campaign campaign = campaignRepository.findById(campaignId)
            .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));
        verifyParty(requesterId, campaign);
        return contractMapper.toResponse(contract, campaign);
    }

    @Transactional
    public ContractResponse signCreator(UUID creatorId, UUID contractId, SignContractRequest request) {
        DigitalContract contract = contractRepository.findById(contractId)
            .orElseThrow(() -> new EntityNotFoundException("Contract not found"));
        if (!StringUtils.hasText(request.signature())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Signature is required");
        }
        applicationRepository.findByCampaignIdAndCreatorId(contract.getCampaignId(), creatorId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Contract does not belong to creator"));
        if (StringUtils.hasText(contract.getCreatorSignature())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already signed");
        }

        contract.setCreatorSignature(request.signature().trim());
        contract.setCreatorSignedAt(Instant.now());
        Campaign campaign = campaignRepository.findById(contract.getCampaignId())
            .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));
        if (StringUtils.hasText(contract.getBrandSignature())) {
            triggerEscrowRelease(contract);
        } else {
            contract.setStatus(DigitalContract.Status.PENDING);
        }
        DigitalContract saved = contractRepository.save(contract);

        notificationService.sendToUser(
            campaign.getBrandId(),
            Notification.Type.SYSTEM,
            "Creator signed contract",
            "Creator signed the contract for " + campaign.getTitle(),
            "/brand/contracts/" + contract.getId(),
            Map.of("campaignId", campaign.getId().toString())
        );
        return contractMapper.toResponse(saved, campaign);
    }

    @Transactional
    public ContractResponse signBrand(UUID brandUserId, UUID contractId, SignContractRequest request) {
        DigitalContract contract = contractRepository.findById(contractId)
            .orElseThrow(() -> new EntityNotFoundException("Contract not found"));
        if (!StringUtils.hasText(request.signature())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Signature is required");
        }
        Campaign campaign = campaignRepository.findById(contract.getCampaignId())
            .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));
        if (!campaign.getBrandId().equals(brandUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Contract does not belong to brand");
        }
        if (StringUtils.hasText(contract.getBrandSignature())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already signed");
        }

        contract.setBrandSignature(request.signature().trim());
        contract.setBrandSignedAt(Instant.now());
        if (StringUtils.hasText(contract.getCreatorSignature())) {
            triggerEscrowRelease(contract);
        } else {
            contract.setStatus(DigitalContract.Status.PENDING);
        }
        DigitalContract saved = contractRepository.save(contract);

        Application application = applicationForContract(contract);
        notificationService.sendToUser(
            application.getCreatorId(),
            Notification.Type.PAYMENT,
            "Brand signed — payment is being processed",
            "Brand signed — payment is being processed",
            "/campaigns/active/" + campaign.getId(),
            Map.of("campaignId", campaign.getId().toString())
        );
        return contractMapper.toResponse(saved, campaign);
    }

    @Transactional
    void triggerEscrowRelease(DigitalContract contract) {
        String escrowKey = "escrow-release-" + contract.getId();
        if (transactionRepository.existsByIdempotencyKey(escrowKey)) {
            contract.setStatus(DigitalContract.Status.COMPLETED);
            return;
        }

        Campaign campaign = campaignRepository.findByIdForUpdate(contract.getCampaignId())
            .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));
        if (!Boolean.TRUE.equals(campaign.getEscrowLocked())) {
            throw new IllegalStateException("Campaign escrow is not locked");
        }

        Brand brand = brandRepository.findByIdForUpdate(campaign.getBrandId())
            .orElseThrow(() -> new EntityNotFoundException("Brand not found"));
        Application application = applicationForContract(contract);
        CreatorProfile creator = creatorProfileRepository.findById(application.getCreatorId())
            .orElseThrow(() -> new EntityNotFoundException("Creator not found"));

        BigDecimal gross = campaign.getCreatorPayout().setScale(2, RoundingMode.HALF_UP);
        BigDecimal fee = gross.multiply(BigDecimal.valueOf(0.10)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal net = gross.subtract(fee).setScale(2, RoundingMode.HALF_UP);

        creator.setAvailableBalance(creator.getAvailableBalance().add(net));
        creatorProfileRepository.save(creator);

        transactionRepository.save(Transaction.builder()
            .type(Transaction.Type.ESCROW_RELEASE)
            .fromUserId(brand.getUserId())
            .toUserId(creator.getUserId())
            .amount(gross)
            .platformFee(fee)
            .netAmount(net)
            .idempotencyKey(escrowKey)
            .campaignId(campaign.getId())
            .status(Transaction.Status.COMPLETED)
            .build());

        String feeKey = "platform-fee-" + contract.getId();
        if (!transactionRepository.existsByIdempotencyKey(feeKey)) {
            transactionRepository.save(Transaction.builder()
                .type(Transaction.Type.PLATFORM_FEE)
                .amount(fee)
                .platformFee(BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP))
                .netAmount(fee)
                .idempotencyKey(feeKey)
                .campaignId(campaign.getId())
                .status(Transaction.Status.COMPLETED)
                .build());
        }

        brand.setEscrowAllocated(brand.getEscrowAllocated().subtract(gross));
        brand.setTotalSpent(brand.getTotalSpent().add(gross));
        brandRepository.save(brand);

        contract.setStatus(DigitalContract.Status.COMPLETED);
        campaign.setStatus(Campaign.Status.COMPLETED);
        campaignRepository.save(campaign);

        notificationService.sendToUser(
            creator.getUserId(),
            Notification.Type.PAYMENT,
            "Payment Processing",
            "₹%s will arrive in 3–5 business days".formatted(net),
            "/wallet",
            Map.of("campaignId", campaign.getId().toString(), "amount", net.toPlainString())
        );
    }

    private void verifyParty(UUID requesterId, Campaign campaign) {
        if (campaign.getBrandId().equals(requesterId)) {
            return;
        }
        boolean creatorParty = applicationRepository.findByCampaignIdAndCreatorId(campaign.getId(), requesterId).isPresent();
        if (!creatorParty) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No access to contract");
        }
    }

    private Application applicationForContract(DigitalContract contract) {
        Deliverable deliverable = deliverableRepository.findById(contract.getDeliverableId())
            .orElseThrow(() -> new EntityNotFoundException("Deliverable not found"));
        return applicationRepository.findById(deliverable.getApplicationId())
            .orElseThrow(() -> new EntityNotFoundException("Application not found"));
    }
}
