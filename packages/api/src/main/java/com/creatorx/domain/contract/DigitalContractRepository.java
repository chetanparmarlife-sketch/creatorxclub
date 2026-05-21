package com.creatorx.domain.contract;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DigitalContractRepository extends JpaRepository<DigitalContract, UUID> {
}
