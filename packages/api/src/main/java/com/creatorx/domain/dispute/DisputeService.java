package com.creatorx.domain.dispute;

import com.creatorx.domain.application.Application;
import com.creatorx.domain.application.ApplicationRepository;
import com.creatorx.domain.brand.Brand;
import com.creatorx.domain.campaign.Campaign;
import com.creatorx.domain.campaign.CampaignRepository;
import com.creatorx.domain.creator.CreatorProfile;
import com.creatorx.domain.creator.CreatorProfileRepository;
import com.creatorx.domain.dispute.dto.DisputeResponse;
import com.creatorx.domain.dispute.dto.RaiseDisputeRequest;
import com.creatorx.domain.notification.Notification;
import com.creatorx.domain.notification.NotificationService;
import com.creatorx.domain.user.User;
import com.creatorx.domain.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
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
public class DisputeService {

    private final DisputeCaseRepository disputeRepository;
    private final CampaignRepository campaignRepository;
    private final ApplicationRepository applicationRepository;
    private final CreatorProfileRepository creatorProfileRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final DisputeMapper disputeMapper;

    @Transactional
    public DisputeResponse raise(UUID requesterId, RaiseDisputeRequest request) {
        if (!StringUtils.hasText(request.description()) || request.description().trim().length() < 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Description must be at least 100 characters");
        }
        Campaign campaign = campaignRepository.findByIdForUpdate(request.campaignId())
            .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));
        Application application = resolveApplication(requesterId, campaign, request.applicationId());
        boolean requesterIsCreator = application.getCreatorId().equals(requesterId);
        if (!requesterIsCreator && !campaign.getBrandId().equals(requesterId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Requester is not a party to this campaign");
        }
        if (disputeRepository.existsByCampaignIdAndStatusIn(campaign.getId(), List.of(DisputeCase.Status.OPEN, DisputeCase.Status.UNDER_REVIEW))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Open dispute already exists");
        }

        campaign.setEscrowLocked(true);
        campaignRepository.save(campaign);

        DisputeCase dispute = disputeRepository.save(DisputeCase.builder()
            .campaignId(campaign.getId())
            .raisedByUserId(requesterId)
            .reason(request.reason())
            .description(request.description().trim())
            .evidence(disputeMapper.writeList(request.evidenceUrls()))
            .status(DisputeCase.Status.OPEN)
            .build());

        notifyAdmins(dispute, campaign, requesterId);
        notifyOtherParty(dispute, campaign, application, requesterIsCreator);
        return disputeMapper.toResponse(dispute);
    }

    @Transactional(readOnly = true)
    public DisputeResponse mine(UUID requesterId, UUID campaignId) {
        return disputeRepository.findByCampaignIdAndRaisedByUserId(campaignId, requesterId)
            .map(disputeMapper::toResponse)
            .orElseThrow(() -> new EntityNotFoundException("Dispute not found"));
    }

    private Application resolveApplication(UUID requesterId, Campaign campaign, UUID applicationId) {
        if (applicationId != null) {
            Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found"));
            if (!application.getCampaignId().equals(campaign.getId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Application is not for this campaign");
            }
            return application;
        }
        return applicationRepository.findByCampaignIdAndCreatorId(campaign.getId(), requesterId)
            .orElseGet(() -> {
                if (campaign.getBrandId().equals(requesterId)) {
                    return applicationRepository.findAll().stream()
                        .filter(app -> app.getCampaignId().equals(campaign.getId()) && app.getStatus() == Application.Status.APPROVED)
                        .findFirst()
                        .orElseThrow(() -> new EntityNotFoundException("Approved application not found"));
                }
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Requester is not a party to this campaign");
            });
    }

    private void notifyAdmins(DisputeCase dispute, Campaign campaign, UUID raisedBy) {
        String raisedByName = displayName(raisedBy);
        userRepository.findByUserType(User.UserType.ADMIN).forEach(admin -> notificationService.sendToUser(
            admin.getId(),
            Notification.Type.SYSTEM,
            "New Dispute Case",
            "%s raised a dispute for %s".formatted(raisedByName, campaign.getTitle()),
            "/admin/disputes/" + dispute.getId(),
            Map.of("campaignId", campaign.getId().toString(), "disputeId", dispute.getId().toString())
        ));
    }

    private void notifyOtherParty(DisputeCase dispute, Campaign campaign, Application application, boolean requesterIsCreator) {
        UUID otherUserId = requesterIsCreator ? campaign.getBrandId() : application.getCreatorId();
        notificationService.sendToUser(
            otherUserId,
            Notification.Type.SYSTEM,
            "Dispute Raised",
            "A dispute has been raised for " + campaign.getTitle(),
            requesterIsCreator ? "/brand/disputes/" + dispute.getId() : "/campaigns/active/" + campaign.getId() + "/dispute",
            Map.of("campaignId", campaign.getId().toString(), "disputeId", dispute.getId().toString())
        );
    }

    private String displayName(UUID userId) {
        return creatorProfileRepository.findById(userId)
            .map(CreatorProfile::getDisplayName)
            .filter(StringUtils::hasText)
            .orElseGet(() -> userRepository.findById(userId)
                .map(user -> StringUtils.hasText(user.getEmail()) ? user.getEmail() : user.getPhoneNumber())
                .orElse("A user"));
    }
}
