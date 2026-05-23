package com.creatorx.domain.contract;

import com.creatorx.auth.CurrentUser;
import com.creatorx.domain.contract.dto.ContractResponse;
import com.creatorx.domain.contract.dto.SignContractRequest;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contracts")
@RequiredArgsConstructor
public class ContractController {

    private final ContractService contractService;
    private final CurrentUser currentUser;

    @GetMapping("/campaign/{campaignId}")
    @PreAuthorize("hasRole('CREATOR') or hasRole('BRAND')")
    public ContractResponse getByCampaign(@PathVariable UUID campaignId) {
        return contractService.getByCampaign(currentUser.id(), campaignId);
    }

    @PostMapping("/{id}/sign/creator")
    @PreAuthorize("hasRole('CREATOR')")
    public ContractResponse signCreator(@PathVariable UUID id, @Valid @RequestBody SignContractRequest request) {
        return contractService.signCreator(currentUser.id(), id, request);
    }

    @PostMapping("/{id}/sign/brand")
    @PreAuthorize("hasRole('BRAND')")
    public ContractResponse signBrand(@PathVariable UUID id, @Valid @RequestBody SignContractRequest request) {
        return contractService.signBrand(currentUser.id(), id, request);
    }
}
