package com.skillshare.repository;

import com.skillshare.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    List<Post> findByUserId(Long userId);
    Page<Post> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
} 