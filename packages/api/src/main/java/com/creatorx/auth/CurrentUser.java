package com.creatorx.auth;

import java.util.UUID;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUser {

    public UUID id() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new IllegalStateException("No authenticated user is available");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CreatorXPrincipal creatorXPrincipal) {
            return creatorXPrincipal.id();
        }

        return UUID.fromString(authentication.getName());
    }
}
