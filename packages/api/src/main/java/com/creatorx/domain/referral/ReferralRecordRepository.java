package com.creatorx.domain.referral;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReferralRecordRepository extends JpaRepository<ReferralRecord, UUID> {
}
