package com.creatorx.domain.dispute;

import com.creatorx.auth.CurrentUser;
import com.creatorx.domain.dispute.dto.DisputeResponse;
import com.creatorx.domain.dispute.dto.RaiseDisputeRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/disputes")
@RequiredArgsConstructor
public class DisputeController {

    private final DisputeService disputeService;
    private final CurrentUser currentUser;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('CREATOR') or hasRole('BRAND')")
    public DisputeResponse raise(@Valid @RequestBody RaiseDisputeRequest request) {
        return disputeService.raise(currentUser.id(), request);
    }

    @GetMapping("/campaign/{campaignId}/mine")
    @PreAuthorize("hasRole('CREATOR') or hasRole('BRAND')")
    public DisputeResponse mine(@PathVariable UUID campaignId) {
        return disputeService.mine(currentUser.id(), campaignId);
    }
}
