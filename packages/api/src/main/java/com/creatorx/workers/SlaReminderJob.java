package com.creatorx.workers;

import com.creatorx.domain.application.Application;
import com.creatorx.domain.application.ApplicationRepository;
import com.creatorx.domain.campaign.Campaign;
import com.creatorx.domain.campaign.CampaignRepository;
import com.creatorx.domain.deliverable.Deliverable;
import com.creatorx.domain.deliverable.DeliverableRepository;
import com.creatorx.domain.notification.Notification;
import com.creatorx.domain.notification.NotificationService;
import jakarta.persistence.EntityNotFoundException;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SlaReminderJob {

    private static final Pattern FIRST_NUMBER = Pattern.compile("(\\d+)");

    private final ApplicationRepository applicationRepository;
    private final CampaignRepository campaignRepository;
    private final DeliverableRepository deliverableRepository;
    private final NotificationService notificationService;
    private final StringRedisTemplate redisTemplate;

    @Scheduled(cron = "0 0 * * * *")
    public void sendSlaReminders() {
        Instant now = Instant.now();
        int sent = 0;
        for (Application application : applicationRepository.findApprovedApplicationsNeedingSubmission()) {
            Campaign campaign = campaignRepository.findById(application.getCampaignId())
                .orElseThrow(() -> new EntityNotFoundException("Campaign not found"));
            Deliverable deliverable = deliverableRepository.findByApplicationId(application.getId()).orElse(null);
            Instant deadline = deliverable == null ? applicationDeadline(application, campaign) : deliverable.getSlaDeadline();
            if (deadline == null || deadline.isBefore(now) || deadline.isAfter(now.plus(24, ChronoUnit.HOURS))) {
                continue;
            }
            String reminderId = deliverable == null ? application.getId().toString() : deliverable.getId().toString();
            String key = "sla-reminded:" + reminderId + ":" + LocalDate.now(ZoneOffset.UTC);
            Boolean firstReminderToday = redisTemplate.opsForValue().setIfAbsent(key, "1", Duration.ofHours(25));
            if (!Boolean.TRUE.equals(firstReminderToday)) {
                continue;
            }
            notificationService.sendToUser(
                application.getCreatorId(),
                Notification.Type.CAMPAIGN,
                "SLA Reminder",
                "⏰ SLA Reminder: Submit content for %s by %s. Less than 24 hours remaining!".formatted(campaign.getTitle(), deadline),
                "/campaigns/active/" + campaign.getId(),
                Map.of("campaignId", campaign.getId().toString(), "deadline", deadline.toString())
            );
            sent++;
        }
        log.info("SLA reminder job sent {} reminders", sent);
    }

    private Instant applicationDeadline(Application application, Campaign campaign) {
        Instant start = application.getUpdatedAt() == null ? application.getCreatedAt() : application.getUpdatedAt();
        return (start == null ? Instant.now() : start).plus(parseSlaDays(campaign.getSlaTerms()), ChronoUnit.DAYS);
    }

    private long parseSlaDays(String slaTerms) {
        if (slaTerms == null) {
            return 7;
        }
        Matcher matcher = FIRST_NUMBER.matcher(slaTerms);
        return matcher.find() ? Long.parseLong(matcher.group(1)) : 7;
    }
}
