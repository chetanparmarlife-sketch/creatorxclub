package com.creatorx.domain.dispute;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisputeCaseRepository extends JpaRepository<DisputeCase, UUID> {
}
