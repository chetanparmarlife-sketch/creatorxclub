package com.creatorx.domain.dispute;

import com.creatorx.domain.dispute.dto.DisputeResponse;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
@RequiredArgsConstructor
public class DisputeMapper {

    private static final TypeReference<List<String>> STRING_LIST = new TypeReference<>() {
    };

    private final ObjectMapper objectMapper;

    public DisputeResponse toResponse(DisputeCase dispute) {
        return new DisputeResponse(
            dispute.getId(),
            dispute.getCampaignId(),
            dispute.getRaisedByUserId(),
            dispute.getReason(),
            dispute.getDescription(),
            readList(dispute.getEvidence()),
            dispute.getStatus(),
            dispute.getAdminNotes(),
            dispute.getResolution(),
            dispute.getResolvedAt(),
            dispute.getCreatedAt()
        );
    }

    public String writeList(List<String> values) {
        try {
            return objectMapper.writeValueAsString(values == null ? List.of() : values);
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to serialize dispute evidence", ex);
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
