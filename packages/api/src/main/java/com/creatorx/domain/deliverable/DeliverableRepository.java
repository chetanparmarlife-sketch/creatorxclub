package com.creatorx.domain.deliverable;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DeliverableRepository extends JpaRepository<Deliverable, UUID> {

    @Query("""
        select d
        from Deliverable d
        where d.slaDeadline between :from and :to
          and d.status = :status
        """)
    List<Deliverable> findBySlaDeadlineBetweenAndStatus(
        @Param("from") Instant from,
        @Param("to") Instant to,
        @Param("status") Deliverable.Status status
    );
}
