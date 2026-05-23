package com.creatorx.domain.application;

import com.creatorx.domain.application.dto.ApplicationPageResponse;
import com.creatorx.domain.application.dto.ApplicationResponse;
import com.creatorx.domain.application.dto.SubmitApplicationRequest;
import com.creatorx.domain.brand.Brand;
import com.creatorx.domain.brand.BrandRepository;
import com.creatorx.domain.campaign.Campaign;
import com.creatorx.domain.campaign.CampaignRepository;
import com.creatorx.domain.creator.CreatorProfile;
import com.creatorx.domain.creator.CreatorProfileRepository;
import com.creatorx.domain.notification.Notification;
import com.creatorx.domain.notification.NotificationService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {
    };

    private final ApplicationRepository applicationRepository;
    private final CampaignRepository campaignRepository;
    private final CreatorProfileRepository creatorProfileRepository;
    private final BrandRepository brandRepository;
    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    @Transactional
    public ApplicationResponse submitApplication(UUID creatorId, UUID campaignId, SubmitApplicationRequest request) {
        CreatorProfile creator = creatorProfileRepository.findById(creatorId)
            .orElseThrow(() -> new EntityNotFoundException("Creator profile not found"));
        if (creator.getKycStatus() != CreatorProfile.KycStatus.APPROVED) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "KYC verification required");
        }

        Campaign campaign = campaignRepository.findById(campaignId)
            .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));
        if (campaign.getStatus() != Campaign.Status.LIVE) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Campaign is not accepting applications");
        }
        if (applicationRepository.existsByCampaignIdAndCreatorId(campaignId, creatorId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already applied");
        }

        validateRequest(request);

        BigDecimal proposedPrice = Boolean.TRUE.equals(campaign.getNegotiationEnabled()) && request.proposedPrice() != null
            ? request.proposedPrice()
            : campaign.getCreatorPayout();

        Application application = applicationRepository.save(Application.builder()
            .campaignId(campaignId)
            .creatorId(creatorId)
            .pitchMessage(request.pitchMessage().trim())
            .portfolioLinks(writePortfolioLinks(request.portfolioLinks()))
            .proposedPrice(proposedPrice)
            .status(Application.Status.PENDING)
            .build());

        Brand brand = brandRepository.findById(campaign.getBrandId())
            .orElseThrow(() -> new EntityNotFoundException("Brand not found"));
        String displayName = StringUtils.hasText(creator.getDisplayName()) ? creator.getDisplayName() : "A creator";
        notificationService.sendToUser(
            brand.getUserId(),
            Notification.Type.CAMPAIGN,
            "New Application Received",
            "%s applied to %s".formatted(displayName, campaign.getTitle()),
            "/brand/applications?campaignId=" + campaignId,
            Map.of("campaignId", campaignId.toString(), "creatorId", creatorId.toString())
        );

        return toResponse(application, campaign, brand);
    }

    @Transactional(readOnly = true)
    public ApplicationPageResponse getCreatorApplications(UUID creatorId, Application.Status status, int page, int limit) {
        PageRequest pageRequest = PageRequest.of(Math.max(page, 0), Math.min(Math.max(limit, 1), 50));
        Page<Application> applications = status == null
            ? applicationRepository.findByCreatorIdOrderByCreatedAtDesc(creatorId, pageRequest)
            : applicationRepository.findByCreatorIdAndStatusOrderByCreatedAtDesc(creatorId, status, pageRequest);

        List<ApplicationResponse> responses = applications.getContent().stream()
            .map(this::toResponse)
            .toList();
        return new ApplicationPageResponse(
            responses,
            applications.getNumber(),
            applications.getTotalPages(),
            applications.getTotalElements()
        );
    }

    public ApplicationResponse toResponse(Application application) {
        Campaign campaign = campaignRepository.findById(application.getCampaignId()).orElse(null);
        Brand brand = campaign == null ? null : brandRepository.findById(campaign.getBrandId()).orElse(null);
        return toResponse(application, campaign, brand);
    }

    private ApplicationResponse toResponse(Application application, Campaign campaign, Brand brand) {
        return new ApplicationResponse(
            application.getId(),
            application.getCampaignId(),
            application.getCreatorId(),
            application.getPitchMessage(),
            application.getProposedPrice(),
            readPortfolioLinks(application.getPortfolioLinks()),
            application.getStatus(),
            application.getBrandFeedback(),
            application.getCounterOfferAmount(),
            campaign == null ? null : new ApplicationResponse.CampaignSummary(
                campaign.getTitle(),
                brand == null ? "Unknown Brand" : brand.getCompanyName(),
                campaign.getCompensationType()
            ),
            application.getCreatedAt(),
            application.getUpdatedAt()
        );
    }

    private void validateRequest(SubmitApplicationRequest request) {
        if (request == null || !StringUtils.hasText(request.pitchMessage()) || request.pitchMessage().trim().length() < 50) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Pitch too short");
        }

        List<String> portfolioLinks = request.portfolioLinks() == null ? List.of() : request.portfolioLinks();
        boolean invalidUrl = portfolioLinks.stream()
            .filter(StringUtils::hasText)
            .anyMatch(link -> !isValidHttpUrl(link));
        if (invalidUrl) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid portfolio URL");
        }

        if (request.proposedPrice() != null && request.proposedPrice().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid proposed price");
        }
    }

    private boolean isValidHttpUrl(String value) {
        try {
            URI uri = URI.create(value);
            return "http".equalsIgnoreCase(uri.getScheme()) || "https".equalsIgnoreCase(uri.getScheme());
        } catch (IllegalArgumentException ex) {
            return false;
        }
    }

    private String writePortfolioLinks(List<String> links) {
        try {
            List<String> cleaned = links == null ? List.of() : links.stream()
                .filter(StringUtils::hasText)
                .map(String::trim)
                .toList();
            return objectMapper.writeValueAsString(cleaned);
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid portfolio URL");
        }
    }

    private List<String> readPortfolioLinks(String json) {
        if (!StringUtils.hasText(json)) {
            return List.of();
        }
        try {
            return objectMapper.readValue(json, STRING_LIST);
        } catch (Exception ignored) {
            return List.of();
        }
    }
}
