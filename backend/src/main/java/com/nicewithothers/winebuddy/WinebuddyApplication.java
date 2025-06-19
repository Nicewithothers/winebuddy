package com.nicewithothers.winebuddy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
public class WinebuddyApplication {
	public static void main(String[] args) {
		SpringApplication.run(WinebuddyApplication.class, args);
	}
}
