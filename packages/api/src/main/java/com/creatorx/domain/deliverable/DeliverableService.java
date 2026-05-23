package com.creatorx.domain.deliverable;

import com.creatorx.domain.application.Application;
import com.creatorx.domain.application.ApplicationRepository;
import com.creatorx.domain.brand.Brand;
import com.creatorx.domain.brand.BrandRepository;
import com.creatorx.domain.campaign.Campaign;
import com.creatorx.domain.campaign.CampaignRepository;
import com.creatorx.domain.contract.DigitalContract;
import com.creatorx.domain.contract.DigitalContractRepository;
import com.creatorx.domain.creator.CreatorProfile;
import com.creatorx.domain.creator.CreatorProfileRepository;
import com.creatorx.domain.deliverable.dto.DeliverableResponse;
import com.creatorx.domain.deliverable.dto.SubmitDeliverableRequest;
import com.creatorx.domain.deliverable.dto.UpdateDeliverableRequest;
import com.creatorx.domain.notification.Notification;
import com.creatorx.domain.notification.NotificationService;
import com.creatorx.domain.user.User;
import com.creatorx.domain.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class DeliverableService {

    private static final Pattern FIRST_NUMBER = Pattern.compile("(\\d+)");

    private final DeliverableRepository deliverableRepository;
    private final ApplicationRepository applicationRepository;
    private final CampaignRepository campaignRepository;
    private final BrandRepository brandRepository;
    private final CreatorProfileRepository creatorProfileRepository;
    private final DigitalContractRepository contractRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final DeliverableMapper deliverableMapper;

    @Transactional
    public DeliverableResponse submit(UUID creatorId, SubmitDeliverableRequest request) {
        Application application = applicationRepository.findByIdAndCreatorId(request.applicationId(), creatorId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.FORBIDDEN, "Application does not belong to creator"));
        if (application.getStatus() != Application.Status.APPROVED || !application.getCampaignId().equals(request.campaignId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Application must be approved");
        }

        Campaign campaign = campaignRepository.findById(request.campaignId())
            .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));
        if (campaign.getStatus() != Campaign.Status.LIVE) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Campaign is not accepting deliverables");
        }
        if (deliverableRepository.existsByApplicationId(application.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already submitted");
        }
        CreatorProfile creator = creatorProfileRepository.findById(creatorId)
            .orElseThrow(() -> new EntityNotFoundException("Creator not found"));
        if (isGifting(campaign) && !Boolean.TRUE.equals(creator.getProductReceiptConfirmed())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Product receipt confirmation required");
        }
        validatePayload(request.contentFiles(), request.captions(), request.hashtags());

        Instant submittedAt = Instant.now();
        Deliverable deliverable = deliverableRepository.save(Deliverable.builder()
            .applicationId(application.getId())
            .campaignId(campaign.getId())
            .creatorId(creatorId)
            .contentFiles(deliverableMapper.writeList(request.contentFiles()))
            .captions(request.captions().trim())
            .hashtags(deliverableMapper.writeList(request.hashtags()))
            .postingInstructions(request.postingInstructions())
            .submittedAt(submittedAt)
            .status(Deliverable.Status.PENDING_REVIEW)
            .slaDeadline(slaDeadline(application, campaign))
            .productReceiptConfirmed(Boolean.TRUE.equals(creator.getProductReceiptConfirmed()))
            .build());

        notifyBrand(campaign, creator, "New Content Submitted", "%s submitted content for %s".formatted(displayName(creator), campaign.getTitle()));
        return deliverableMapper.toResponse(deliverable);
    }

    @Transactional
    public DeliverableResponse update(UUID creatorId, UUID deliverableId, UpdateDeliverableRequest request) {
        Deliverable deliverable = deliverableRepository.findById(deliverableId)
            .orElseThrow(() -> new EntityNotFoundException("Deliverable not found"));
        if (!deliverable.getCreatorId().equals(creatorId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Deliverable does not belong to creator");
        }
        if (deliverable.getStatus() != Deliverable.Status.REVISION_REQUESTED) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Only revisions allowed");
        }
        validatePayload(request.contentFiles(), request.captions(), request.hashtags());

        deliverable.setContentFiles(deliverableMapper.writeList(request.contentFiles()));
        deliverable.setCaptions(request.captions().trim());
        deliverable.setHashtags(deliverableMapper.writeList(request.hashtags()));
        deliverable.setStatus(Deliverable.Status.PENDING_REVIEW);
        deliverable.setRevisionNotes(null);
        deliverable.setSubmittedAt(Instant.now());
        Deliverable saved = deliverableRepository.save(deliverable);

        Campaign campaign = campaignRepository.findById(saved.getCampaignId())
            .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));
        CreatorProfile creator = creatorProfileRepository.findById(creatorId)
            .orElseThrow(() -> new EntityNotFoundException("Creator not found"));
        notifyBrand(campaign, creator, "Revised Content Submitted", "Revised content submitted for " + campaign.getTitle());
        return deliverableMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public DeliverableResponse get(UUID requesterId, UUID deliverableId) {
        Deliverable deliverable = deliverableRepository.findById(deliverableId)
            .orElseThrow(() -> new EntityNotFoundException("Deliverable not found"));
        Campaign campaign = campaignRepository.findById(deliverable.getCampaignId())
            .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));
        boolean admin = userRepository.findById(requesterId)
            .map(user -> user.getUserType() == User.UserType.ADMIN)
            .orElse(false);
        if (!admin && !deliverable.getCreatorId().equals(requesterId) && !campaign.getBrandId().equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "No access to deliverable");
        }
        return deliverableMapper.toResponse(deliverable);
    }

    @Transactional
    public Map<String, String> confirmReceipt(UUID creatorId, UUID deliverableId) {
        Deliverable deliverable = deliverableRepository.findById(deliverableId)
            .orElseThrow(() -> new EntityNotFoundException("Deliverable not found"));
        if (!deliverable.getCreatorId().equals(creatorId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Deliverable does not belong to creator");
        }
        Campaign campaign = campaignRepository.findById(deliverable.getCampaignId())
            .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));
        if (!isGifting(campaign)) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Not a gifting campaign");
        }
        if (Boolean.TRUE.equals(deliverable.getProductReceiptConfirmed())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already confirmed");
        }
        deliverable.setProductReceiptConfirmed(true);
        deliverableRepository.save(deliverable);

        CreatorProfile creator = creatorProfileRepository.findById(creatorId)
            .orElseThrow(() -> new EntityNotFoundException("Creator not found"));
        creator.setProductReceiptConfirmed(true);
        creatorProfileRepository.save(creator);

        notificationService.sendToUser(
            creatorId,
            Notification.Type.SYSTEM,
            "Product receipt confirmed",
            "📦 Product receipt confirmed — you can now upload your content",
            "/campaigns/active/" + campaign.getId(),
            Map.of("campaignId", campaign.getId().toString())
        );
        return Map.of("message", "Receipt confirmed. Content upload unlocked.");
    }

    private Instant slaDeadline(Application application, Campaign campaign) {
        long days = 7L;
        if (StringUtils.hasText(campaign.getSlaTerms())) {
            Matcher matcher = FIRST_NUMBER.matcher(campaign.getSlaTerms());
            if (matcher.find()) {
                days = Long.parseLong(matcher.group(1));
            }
        }
        Instant approvedAt = application.getUpdatedAt() == null ? application.getCreatedAt() : application.getUpdatedAt();
        return (approvedAt == null ? Instant.now() : approvedAt).plus(days, ChronoUnit.DAYS);
    }

    private void validatePayload(java.util.List<String> files, String captions, java.util.List<String> hashtags) {
        if (files == null || files.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Content files are required");
        }
        if (!StringUtils.hasText(captions)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Caption is required");
        }
        if (hashtags == null || hashtags.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Hashtags are required");
        }
    }

    private boolean isGifting(Campaign campaign) {
        return campaign.getCompensationType() == Campaign.CompensationType.GIFTING
            || campaign.getCompensationType() == Campaign.CompensationType.MIXED;
    }

    private void notifyBrand(Campaign campaign, CreatorProfile creator, String title, String message) {
        Brand brand = brandRepository.findById(campaign.getBrandId())
            .orElseThrow(() -> new EntityNotFoundException("Brand not found"));
        notificationService.sendToUser(
            brand.getUserId(),
            Notification.Type.CAMPAIGN,
            title,
            message,
            "/brand/deliverables?campaignId=" + campaign.getId(),
            Map.of("campaignId", campaign.getId().toString(), "creatorId", creator.getUserId().toString())
        );
    }

    private String displayName(CreatorProfile creator) {
        return StringUtils.hasText(creator.getDisplayName()) ? creator.getDisplayName() : "Creator";
    }
}
