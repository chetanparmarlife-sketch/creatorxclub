package com.creatorx.domain.brand;

import java.util.UUID;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BrandRepository extends JpaRepository<Brand, UUID> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select b from Brand b where b.userId = :userId")
    java.util.Optional<Brand> findByIdForUpdate(@Param("userId") UUID userId);
}
