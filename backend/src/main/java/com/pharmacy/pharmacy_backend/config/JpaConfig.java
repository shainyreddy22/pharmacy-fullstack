package com.pharmacy.pharmacy_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EntityScan("com.pharmacy.pharmacy_backend.model")
@EnableJpaRepositories("com.pharmacy.pharmacy_backend.repository")
public class JpaConfig {
}