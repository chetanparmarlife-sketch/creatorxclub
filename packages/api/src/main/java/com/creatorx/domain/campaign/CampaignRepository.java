package com.creatorx.domain.campaign;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CampaignRepository extends JpaRepository<Campaign, UUID>, JpaSpecificationExecutor<Campaign> {

    @Query("""
        select c
        from Campaign c
        where c.status = :status
          and lower(c.nicheCategories) like lower(concat('%', :niche, '%'))
        """)
    Page<Campaign> findByStatusAndNicheCategoriesContaining(
        @Param("status") Campaign.Status status,
        @Param("niche") String niche,
        Pageable pageable
    );

    @Query(
        value = """
            select c.*
            from campaigns c
            where c.status = 'LIVE'
              and not exists (
                  select 1
                  from applications a
                  where a.campaign_id = c.id
                    and a.creator_id = :creatorId
              )
            """,
        countQuery = """
            select count(*)
            from campaigns c
            where c.status = 'LIVE'
              and not exists (
                  select 1
                  from applications a
                  where a.campaign_id = c.id
                    and a.creator_id = :creatorId
              )
            """,
        nativeQuery = true
    )
    Page<Campaign> findLiveCampaignsForCreator(@Param("creatorId") UUID creatorId, Pageable pageable);

    long countByBrandId(UUID brandId);

    java.util.List<Campaign> findByBrandId(UUID brandId);
}
