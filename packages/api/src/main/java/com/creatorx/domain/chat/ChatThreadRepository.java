package com.creatorx.domain.chat;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatThreadRepository extends JpaRepository<ChatThread, UUID> {

    @Query("""
        select c
        from ChatThread c
        order by c.sentimentScore asc
        """)
    Page<ChatThread> findByOrderBySentimentScoreAsc(Pageable pageable);

    @Query("""
        select c
        from ChatThread c
        where c.flagStatus <> :none
        """)
    Page<ChatThread> findByFlagStatusNot(@Param("none") ChatThread.FlagStatus none, Pageable pageable);
}
