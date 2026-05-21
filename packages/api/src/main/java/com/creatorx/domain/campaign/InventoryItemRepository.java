package com.creatorx.domain.campaign;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, UUID> {
}
