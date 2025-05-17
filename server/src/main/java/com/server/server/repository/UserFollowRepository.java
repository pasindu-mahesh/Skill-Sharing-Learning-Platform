package com.server.server.repository;

import com.server.server.entity.UserFollow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

public interface UserFollowRepository extends JpaRepository<UserFollow, Long> {

    boolean existsByFollowerIdAndFollowingId(UUID followerId, UUID followingId);

    List<UserFollow> findByFollowerId(UUID followerId);

    List<UserFollow> findByFollowingId(UUID followingId);

    @Transactional
    void deleteByFollowerIdAndFollowingId(UUID followerId, UUID followingId);
}
