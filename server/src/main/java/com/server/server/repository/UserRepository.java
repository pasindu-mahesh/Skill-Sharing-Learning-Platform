package com.server.server.repository;

import com.server.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    // Optional method to find User by email or username if needed
    User findByEmail(String email);
    User findByUsername(String username);
}
