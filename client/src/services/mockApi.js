// Initial mock data
const initialMockPosts = [
    {
        id: 1,
        title: 'How to use React Hooks effectively',
        content: 'React Hooks are a powerful feature that allows you to use state and other React features in functional components...',
        category: 'Programming',
        createdAt: new Date().toISOString(),
        mediaFiles: [],
        likes: 15,
        liked: false,
        comments: [
            {
                id: 1,
                username: 'john_doe',
                content: 'Great explanation! Very helpful.',
                createdAt: new Date().toISOString(),
                isEditing: false
            }
        ]
    },
    {
        id: 2,
        title: 'Getting Started with UI Design',
        content: 'Good UI design starts with understanding your users and their needs. Here are some key principles...',
        category: 'Design',
        createdAt: new Date().toISOString(),
        mediaFiles: [],
        likes: 23,
        liked: false,
        comments: []
    },
    {
        id: 3,
        title: 'Digital Marketing Basics',
        content: 'Digital marketing encompasses all marketing efforts that use electronic devices or the internet...',
        category: 'Marketing',
        createdAt: new Date().toISOString(),
        mediaFiles: [],
        likes: 8,
        liked: false,
        comments: []
    }
];

// Initialize localStorage with mock data if it doesn't exist
if (!localStorage.getItem('posts')) {
    localStorage.setItem('posts', JSON.stringify(initialMockPosts));
}

// Helper function to get posts from localStorage
const getPosts = () => {
    const posts = localStorage.getItem('posts');
    return posts ? JSON.parse(posts) : [];
};

// Helper function to save posts to localStorage
const savePosts = (posts) => {
    localStorage.setItem('posts', JSON.stringify(posts));
};

// Helper function to convert file to base64
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

// Mock API functions
export const mockApi = {
    getPosts: () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(getPosts());
            }, 500);
        });
    },

    getPostById: (postId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const posts = getPosts();
                const post = posts.find(p => p.id === postId);
                resolve(post || null);
            }, 200);
        });
    },

    createPost: async (postData) => {
        return new Promise(async (resolve) => {
            setTimeout(async () => {
                const posts = getPosts();
                const mediaFiles = [];
                
                if (postData.mediaFiles && postData.mediaFiles.length > 0) {
                    for (const file of postData.mediaFiles) {
                        const base64 = await fileToBase64(file);
                        mediaFiles.push({
                            type: file.type,
                            url: base64,
                            name: file.name
                        });
                    }
                }

                const newPost = {
                    id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
                    ...postData,
                    mediaFiles,
                    createdAt: new Date().toISOString(),
                    likes: 0,
                    liked: false,
                    comments: []
                };
                
                posts.unshift(newPost);
                savePosts(posts);
                resolve(newPost);
            }, 500);
        });
    },

    updatePost: async (postId, updateData) => {
        return new Promise((resolve, reject) => {
            setTimeout(async () => {
                const posts = getPosts();
                const postIndex = posts.findIndex(p => p.id === postId);
                
                if (postIndex === -1) {
                    reject(new Error('Post not found'));
                    return;
                }

                const post = posts[postIndex];
                let mediaFiles = post.mediaFiles;

                // Handle media files if they're being updated
                if (updateData.mediaFiles && updateData.mediaFiles.length > 0) {
                    mediaFiles = [];
                    for (const file of updateData.mediaFiles) {
                        // If it's a new File object, convert to base64
                        if (file instanceof File) {
                            const base64 = await fileToBase64(file);
                            mediaFiles.push({
                                type: file.type,
                                url: base64,
                                name: file.name
                            });
                        } else {
                            // If it's an existing media file object, keep it
                            mediaFiles.push(file);
                        }
                    }
                }

                const updatedPost = {
                    ...post,
                    ...updateData,
                    mediaFiles,
                    id: postId, // Ensure ID doesn't change
                    createdAt: post.createdAt, // Preserve creation date
                    updatedAt: new Date().toISOString()
                };

                posts[postIndex] = updatedPost;
                savePosts(posts);
                resolve(updatedPost);
            }, 500);
        });
    },

    deletePost: (postId) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const posts = getPosts();
                const postIndex = posts.findIndex(p => p.id === postId);
                
                if (postIndex === -1) {
                    reject(new Error('Post not found'));
                    return;
                }

                posts.splice(postIndex, 1);
                savePosts(posts);
                resolve({ success: true, message: 'Post deleted successfully' });
            }, 200);
        });
    },

    toggleLike: (postId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const posts = getPosts();
                const post = posts.find(p => p.id === postId);
                if (post) {
                    post.liked = !post.liked;
                    post.likes += post.liked ? 1 : -1;
                    savePosts(posts);
                    resolve(post);
                }
            }, 200);
        });
    },

    addComment: (postId, comment) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const posts = getPosts();
                const post = posts.find(p => p.id === postId);
                if (post) {
                    const newComment = {
                        id: (post.comments.length + 1),
                        username: 'user_' + Math.random().toString(36).substr(2, 5),
                        content: comment,
                        createdAt: new Date().toISOString(),
                        isEditing: false
                    };
                    post.comments.push(newComment);
                    savePosts(posts);
                    resolve(post);
                }
            }, 200);
        });
    },

    updateComment: (postId, commentId, newContent) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const posts = getPosts();
                const post = posts.find(p => p.id === postId);
                if (post) {
                    const comment = post.comments.find(c => c.id === commentId);
                    if (comment) {
                        comment.content = newContent;
                        comment.isEditing = false;
                        savePosts(posts);
                    }
                    resolve(post);
                }
            }, 200);
        });
    },

    deleteComment: (postId, commentId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const posts = getPosts();
                const post = posts.find(p => p.id === postId);
                if (post) {
                    post.comments = post.comments.filter(c => c.id !== commentId);
                    savePosts(posts);
                    resolve(post);
                }
            }, 200);
        });
    }
}; 