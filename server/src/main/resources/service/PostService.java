package com.skillshare.service;

import com.skillshare.dto.PostRequest;
import com.skillshare.dto.PostResponse;
import com.skillshare.model.Post;
import com.skillshare.model.Comment;
import com.skillshare.model.Like;
import com.skillshare.model.User;
import com.skillshare.repository.PostRepository;
import com.skillshare.repository.CommentRepository;
import com.skillshare.repository.LikeRepository;
import com.skillshare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    @Transactional
    public PostResponse createPost(PostRequest postRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Post post = new Post();
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setUser(user);

        Post savedPost = postRepository.save(post);
        return mapToPostResponse(savedPost);
    }

    @Transactional(readOnly = true)
    public Page<PostResponse> getAllPosts(Pageable pageable) {
        return postRepository.findAllByOrderByCreatedAtDesc(pageable)
            .map(this::mapToPostResponse);
    }

    @Transactional(readOnly = true)
    public List<PostResponse> getUserPosts(Long userId) {
        return postRepository.findByUserId(userId).stream()
            .map(this::mapToPostResponse)
            .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PostResponse getPost(Long id) {
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Post not found"));
        return mapToPostResponse(post);
    }

    @Transactional
    public PostResponse updatePost(Long id, PostRequest postRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        if (!post.getUser().getEmail().equals(email)) {
            throw new IllegalStateException("You can only update your own posts");
        }

        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        Post updatedPost = postRepository.save(post);
        return mapToPostResponse(updatedPost);
    }

    @Transactional
    public void deletePost(Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        if (!post.getUser().getEmail().equals(email)) {
            throw new IllegalStateException("You can only delete your own posts");
        }

        postRepository.delete(post);
    }

    @Transactional
    public void likePost(Long postId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        if (likeRepository.existsByPostIdAndUserId(postId, user.getId())) {
            throw new IllegalStateException("Post already liked");
        }

        Like like = new Like();
        like.setPost(post);
        like.setUser(user);
        likeRepository.save(like);
    }

    @Transactional
    public void unlikePost(Long postId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        likeRepository.findByPostIdAndUserId(postId, user.getId())
            .ifPresentOrElse(
                likeRepository::delete,
                () -> { throw new EntityNotFoundException("Like not found"); }
            );
    }

    @Transactional
    public Comment addComment(Long postId, String content) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));
        
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setPost(post);
        comment.setUser(user);
        return commentRepository.save(comment);
    }

    @Transactional
    public Comment updateComment(Long commentId, String content) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        if (!comment.getUser().getEmail().equals(email)) {
            throw new IllegalStateException("You can only update your own comments");
        }

        comment.setContent(content);
        return commentRepository.save(comment);
    }

    @Transactional
    public void deleteComment(Long commentId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Comment comment = commentRepository.findById(commentId)
            .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        if (!comment.getUser().getEmail().equals(email) &&
            !comment.getPost().getUser().getEmail().equals(email)) {
            throw new IllegalStateException("Not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    private PostResponse mapToPostResponse(Post post) {
        return PostResponse.builder()
            .id(post.getId())
            .title(post.getTitle())
            .content(post.getContent())
            .authorId(post.getUser().getId())
            .authorUsername(post.getUser().getUsername())
            .createdAt(post.getCreatedAt())
            .updatedAt(post.getUpdatedAt())
            .commentsCount(post.getComments().size())
            .likesCount(post.getLikes().size())
            .build();
    }
} 