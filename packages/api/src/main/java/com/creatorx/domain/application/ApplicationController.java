package com.creatorx.domain.application;

import com.creatorx.auth.CurrentUser;
import com.creatorx.domain.application.dto.ApplicationPageResponse;
import com.creatorx.domain.application.dto.ApplicationResponse;
import com.creatorx.domain.application.dto.SubmitApplicationRequest;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final CurrentUser currentUser;

    @PostMapping("/api/campaigns/{id}/applications")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('CREATOR')")
    public ApplicationResponse submitApplication(
        @PathVariable UUID id,
        @RequestBody SubmitApplicationRequest request
    ) {
        return applicationService.submitApplication(currentUser.id(), id, request);
    }

    @GetMapping("/api/creators/applications")
    @PreAuthorize("hasRole('CREATOR')")
    public ApplicationPageResponse getCreatorApplications(
        @RequestParam(required = false) Application.Status status,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int limit
    ) {
        return applicationService.getCreatorApplications(currentUser.id(), status, page, limit);
    }
}
