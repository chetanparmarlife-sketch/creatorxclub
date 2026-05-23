package com.creatorx.domain.deliverable;

import com.creatorx.domain.deliverable.dto.DeliverableResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class DeliverableMapper {

    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper;

    public DeliverableResponse toResponse(Deliverable deliverable) {
        if (deliverable == null) {
            return null;
        }
        return new DeliverableResponse(
            deliverable.getId(),
            deliverable.getApplicationId(),
            deliverable.getCampaignId(),
            deliverable.getCreatorId(),
            readList(deliverable.getContentFiles()),
            deliverable.getCaptions(),
            readList(deliverable.getHashtags()),
            deliverable.getPostingInstructions(),
            deliverable.getSubmittedAt(),
            deliverable.getStatus(),
            deliverable.getRevisionNotes(),
            deliverable.getSlaDeadline(),
            deliverable.getProductReceiptConfirmed()
        );
    }

    public String writeList(List<String> values) {
        try {
            return objectMapper.writeValueAsString(values == null ? List.of() : values);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to serialize deliverable JSON", ex);
        }
    }

    private List<String> readList(String json) {
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
