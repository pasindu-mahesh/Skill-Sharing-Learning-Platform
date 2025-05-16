package com.server.server.repository;

import com.server.server.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {

    @Modifying
    @Query("UPDATE Profile p SET p.followers = p.followers + 1 WHERE p.id = :id")
    void incrementFollowers(@Param("id") UUID id);

    @Modifying
    @Query("UPDATE Profile p SET p.followers = p.followers - 1 WHERE p.id = :id")
    void decrementFollowers(@Param("id") UUID id);

    @Modifying
    @Query("UPDATE Profile p SET p.following = p.following + 1 WHERE p.id = :id")
    void incrementFollowing(@Param("id") UUID id);

    @Modifying
    @Query("UPDATE Profile p SET p.following = p.following - 1 WHERE p.id = :id")
    void decrementFollowing(@Param("id") UUID id);

}
