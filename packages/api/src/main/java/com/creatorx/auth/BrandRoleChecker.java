package com.creatorx.auth;

import java.util.Collection;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("brandRoleChecker")
public class BrandRoleChecker {

    public boolean hasRole(Authentication authentication, String role) {
        if (authentication == null || !(authentication.getPrincipal() instanceof CreatorXPrincipal principal)) {
            return false;
        }
        return principal.brandRole() != null && principal.brandRole().name().equals(role);
    }

    public boolean hasRole(Authentication authentication, Collection<String> roles) {
        if (authentication == null || roles == null || !(authentication.getPrincipal() instanceof CreatorXPrincipal principal)) {
            return false;
        }
        return principal.brandRole() != null && roles.contains(principal.brandRole().name());
    }
}
