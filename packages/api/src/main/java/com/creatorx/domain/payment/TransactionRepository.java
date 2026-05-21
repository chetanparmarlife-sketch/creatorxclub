package com.creatorx.domain.payment;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {

    @Query("""
        select count(t) > 0
        from Transaction t
        where t.idempotencyKey = :key
        """)
    boolean existsByIdempotencyKey(@Param("key") String key);
}
