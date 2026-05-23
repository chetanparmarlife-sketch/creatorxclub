package com.creatorx.domain.campaign;

import com.creatorx.auth.CreatorXPrincipal;
import com.creatorx.auth.CurrentUser;
import com.creatorx.domain.application.ApplicationService;
import com.creatorx.domain.application.dto.ApplicationResponse;
import com.creatorx.domain.campaign.dto.CampaignDetailResponse;
import com.creatorx.domain.campaign.dto.CampaignFeedResponse;
import com.creatorx.domain.campaign.dto.CampaignFilterRequest;
import com.creatorx.domain.user.User;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CampaignController {

    private final CampaignService campaignService;
    private final ApplicationService applicationService;
    private final CurrentUser currentUser;

    @GetMapping("/api/campaigns")
    @PreAuthorize("hasRole('CREATOR')")
    public CampaignFeedResponse getCampaigns(@ModelAttribute CampaignFilterRequest filters) {
        return campaignService.getExploreCampaigns(currentUser.id(), filters);
    }

    @GetMapping("/api/campaigns/{id}")
    @PreAuthorize("hasRole('CREATOR') or hasRole('BRAND') or hasRole('ADMIN')")
    public CampaignDetailResponse getCampaign(@PathVariable UUID id, Authentication authentication) {
        return campaignService.getCampaignDetail(currentUser.id(), userType(authentication), id);
    }

    @GetMapping("/api/campaigns/{id}/my-application")
    @PreAuthorize("hasRole('CREATOR')")
    public ApplicationResponse getMyApplication(@PathVariable UUID id) {
        return applicationService.toResponse(campaignService.getMyApplication(currentUser.id(), id));
    }

    @PostMapping("/api/creators/saved-campaigns/{campaignId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('CREATOR')")
    public void saveCampaign(@PathVariable UUID campaignId) {
        campaignService.saveCampaign(currentUser.id(), campaignId);
    }

    @DeleteMapping("/api/creators/saved-campaigns/{campaignId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('CREATOR')")
    public void deleteSavedCampaign(@PathVariable UUID campaignId) {
        campaignService.deleteSavedCampaign(currentUser.id(), campaignId);
    }

    @GetMapping("/api/creators/saved-campaigns")
    @PreAuthorize("hasRole('CREATOR')")
    public List<UUID> getSavedCampaigns() {
        return campaignService.getSavedCampaignIds(currentUser.id());
    }

    private User.UserType userType(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof CreatorXPrincipal principal) {
            return principal.userType();
        }
        throw new IllegalStateException("No authenticated user is available");
    }
}
