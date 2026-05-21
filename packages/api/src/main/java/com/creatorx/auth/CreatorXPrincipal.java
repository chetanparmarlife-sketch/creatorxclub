package com.creatorx.auth;

import com.creatorx.domain.brand.BrandTeamMember;
import com.creatorx.domain.user.User;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public record CreatorXPrincipal(
    UUID id,
    String email,
    User.UserType userType,
    BrandTeamMember.Role brandRole,
    Collection<? extends GrantedAuthority> authorities
) implements UserDetails {

    public static CreatorXPrincipal from(User user, BrandTeamMember.Role brandRole) {
        return new CreatorXPrincipal(
            user.getId(),
            user.getEmail(),
            user.getUserType(),
            brandRole,
            List.of(new SimpleGrantedAuthority("ROLE_" + user.getUserType().name()))
        );
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return id.toString();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
