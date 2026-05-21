package com.creatorx.domain.event;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRegistrationRepository extends JpaRepository<EventRegistration, UUID> {
}
