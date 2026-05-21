package com.creatorx.domain.community;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommunityPostRepository extends JpaRepository<CommunityPost, UUID> {
}
