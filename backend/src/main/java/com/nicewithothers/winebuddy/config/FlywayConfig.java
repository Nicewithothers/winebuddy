package com.nicewithothers.winebuddy.config;

import org.flywaydb.core.Flyway;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class FlywayConfig {
    public FlywayConfig(DataSource dataSource) {
        Flyway.configure()
                .baselineOnMigrate(true)
                .baselineVersion("0.0");
    }
}
