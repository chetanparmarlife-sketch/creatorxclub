package com.creatorx.domain.deliverable;

import com.creatorx.auth.CurrentUser;
import com.creatorx.domain.deliverable.dto.DeliverableResponse;
import com.creatorx.domain.deliverable.dto.SubmitDeliverableRequest;
import com.creatorx.domain.deliverable.dto.UpdateDeliverableRequest;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/deliverables")
@RequiredArgsConstructor
public class DeliverableController {

    private final DeliverableService deliverableService;
    private final CurrentUser currentUser;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('CREATOR')")
    public DeliverableResponse submit(@Valid @RequestBody SubmitDeliverableRequest request) {
        return deliverableService.submit(currentUser.id(), request);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CREATOR')")
    public DeliverableResponse update(@PathVariable UUID id, @Valid @RequestBody UpdateDeliverableRequest request) {
        return deliverableService.update(currentUser.id(), id, request);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CREATOR') or hasRole('BRAND') or hasRole('ADMIN')")
    public DeliverableResponse get(@PathVariable UUID id) {
        return deliverableService.get(currentUser.id(), id);
    }

    @PostMapping("/{id}/confirm-receipt")
    @PreAuthorize("hasRole('CREATOR')")
    public Map<String, String> confirmReceipt(@PathVariable UUID id) {
        return deliverableService.confirmReceipt(currentUser.id(), id);
    }
}
