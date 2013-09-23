package edu.helsinki.sulka;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LoggerProvider {
    @Bean
    public Logger logger() {
        return LoggerFactory.getLogger("edu.helsinki.sulka");
    }
}