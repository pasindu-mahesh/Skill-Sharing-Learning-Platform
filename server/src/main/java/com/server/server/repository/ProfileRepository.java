package com.server.server.repository;

import com.server.server.entity.Profile;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {
    // Change all WHERE clauses from p.userId to p.id
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Profile p SET p.following = p.following + 1 WHERE p.id = :userId")
    void incrementFollowing(@Param("userId") UUID userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Profile p SET p.followers = p.followers + 1 WHERE p.id = :userId")
    void incrementFollowers(@Param("userId") UUID userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Profile p SET p.following = p.following - 1 WHERE p.id = :userId")
    void decrementFollowing(@Param("userId") UUID userId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE Profile p SET p.followers = p.followers - 1 WHERE p.id = :userId")
    void decrementFollowers(@Param("userId") UUID userId);

}
