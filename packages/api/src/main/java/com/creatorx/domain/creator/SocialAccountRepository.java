package com.creatorx.domain.creator;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SocialAccountRepository extends JpaRepository<SocialAccount, UUID> {

    List<SocialAccount> findByCreatorIdOrderByPlatformAsc(UUID creatorId);

    Optional<SocialAccount> findByCreatorIdAndPlatform(UUID creatorId, CreatorProfile.Platform platform);
}
