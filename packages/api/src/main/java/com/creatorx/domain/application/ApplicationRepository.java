package com.creatorx.domain.application;

import java.util.Optional;
import java.util.UUID;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ApplicationRepository extends JpaRepository<Application, UUID> {

    @Query("""
        select a
        from Application a
        where a.creatorId = :creatorId
        order by a.createdAt desc
        """)
    Page<Application> findByCreatorIdOrderByCreatedAtDesc(@Param("creatorId") UUID creatorId, Pageable pageable);

    @Query("""
        select count(a)
        from Application a
        where a.status = :status
          and a.campaignId = :campaignId
        """)
    long countByStatusAndCampaignId(
        @Param("status") Application.Status status,
        @Param("campaignId") UUID campaignId
    );

    Optional<Application> findByCampaignIdAndCreatorId(UUID campaignId, UUID creatorId);

    boolean existsByCampaignIdAndCreatorId(UUID campaignId, UUID creatorId);

    List<Application> findByCreatorIdAndStatus(UUID creatorId, Application.Status status);

    Optional<Application> findByIdAndCreatorId(UUID id, UUID creatorId);

    @Query("""
        select a
        from Application a
        where a.status = com.creatorx.domain.application.Application.Status.APPROVED
          and exists (
              select c.id
              from Campaign c
              where c.id = a.campaignId
                and c.status = com.creatorx.domain.campaign.Campaign.Status.LIVE
          )
          and (
              not exists (
                  select d.id
                  from Deliverable d
                  where d.applicationId = a.id
              )
              or exists (
                  select d2.id
                  from Deliverable d2
                  where d2.applicationId = a.id
                    and d2.status = com.creatorx.domain.deliverable.Deliverable.Status.REVISION_REQUESTED
              )
          )
        """)
    List<Application> findApprovedApplicationsNeedingSubmission();

    @Query("""
        select a
        from Application a
        where a.creatorId = :creatorId
          and a.status = :status
        order by a.createdAt desc
        """)
    Page<Application> findByCreatorIdAndStatusOrderByCreatedAtDesc(
        @Param("creatorId") UUID creatorId,
        @Param("status") Application.Status status,
        Pageable pageable
    );
}
