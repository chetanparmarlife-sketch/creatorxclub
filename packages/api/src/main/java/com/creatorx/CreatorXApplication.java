package com.creatorx;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class CreatorXApplication {

    public static void main(String[] args) {
        SpringApplication.run(CreatorXApplication.class, args);
    }
}
