package com.inventory.config;

import com.inventory.entity.User;
import com.inventory.entity.Warehouse;
import com.inventory.repository.UserRepository;
import com.inventory.repository.WarehouseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final WarehouseRepository warehouseRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository, WarehouseRepository warehouseRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.warehouseRepository = warehouseRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setFullName("StockPulse Admin");
            admin.setEmail("admin@stockpulse.com");
            admin.setPasswordHash(passwordEncoder.encode("Admin@123"));
            admin.setRole(User.Role.ADMIN);
            admin.setIsActive(true);
            userRepository.save(admin);
            logger.info("Seeded default demo admin account: admin@stockpulse.com");
        }

        if (warehouseRepository.count() == 0) {
            Warehouse main = new Warehouse();
            main.setCode("MAIN");
            main.setName("Main Warehouse");
            main.setLocation("Default Location");
            main.setIsActive(true);
            main.setIsDefault(true);
            warehouseRepository.save(main);
            logger.info("Seeded default Main Warehouse");
        }
    }
}
