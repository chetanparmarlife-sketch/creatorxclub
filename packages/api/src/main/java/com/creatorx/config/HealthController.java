package com.creatorx.config;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public HealthResponse health() {
        return new HealthResponse("UP", "creatorx-api");
    }

    public record HealthResponse(String status, String service) {
    }
}
