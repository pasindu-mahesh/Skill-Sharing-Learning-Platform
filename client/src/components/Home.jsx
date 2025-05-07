import React, { useState, useEffect, useRef } from 'react';
import {
    Container,
    Typography,
    Box,
    Avatar,
    Stack,
    Paper,
    CircularProgress,
    Card,
    CardContent,
    Chip,
    ImageList,
    ImageListItem,
    IconButton,
    TextField,
    Button,
    Divider,
    Collapse,
    Menu,
    MenuItem,
    useTheme,
    alpha,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    Modal,
    Fade,
    Backdrop
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import VideoCameraBack from '@mui/icons-material/VideoCameraBack';
import CloseIcon from '@mui/icons-material/Close';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { mockApi } from '../services/mockApi';
import Sidebar from "../components/Sidebar";


const AddStoryDialog = ({ open, onClose, onSave }) => {
    const theme = useTheme();
    const fileInputRef = useRef(null);
    const [storyFile, setStoryFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [caption, setCaption] = useState('');

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const maxFileSize = 5 * 1024 * 1024; // 5MB

        if (file.size > maxFileSize) {
            alert('File is too large. Maximum size is 5MB');
            return;
        }

        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
            alert('Please select an image or video file');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setStoryFile({
                name: file.name,
                type: file.type,
                url: reader.result
            });
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        if (!storyFile) {
            alert('Please select a file for your story');
            return;
        }

        setIsSubmitting(true);
        try {
            const newStory = {
                id: Date.now(),
                userId: 'currentUser',
                username: 'Current User',
                mediaFile: storyFile,
                caption: caption,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
            };
            await onSave(newStory);
            onClose();
        } catch (error) {
            console.error('Error creating story:', error);
            alert('Failed to create story');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 600 }}>Create Story</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <input
                        type="file"
                        accept="image/*,video/*"
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                    />
                    <Stack spacing={2} alignItems="center">
                        {storyFile ? (
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    maxHeight: 400,
                                    borderRadius: 2,
                                    overflow: 'hidden'
                                }}
                            >
                                {storyFile.type.startsWith('image/') ? (
                                    <img
                                        src={storyFile.url}
                                        alt="Story preview"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                ) : (
                                    <video
                                        src={storyFile.url}
                                        controls
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'contain'
                                        }}
                                    />
                                )}
                                <IconButton
                                    onClick={() => setStoryFile(null)}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        bgcolor: 'rgba(0, 0, 0, 0.5)',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: 'rgba(0, 0, 0, 0.7)'
                                        }
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        ) : (
                            <Button
                                variant="outlined"
                                onClick={() => fileInputRef.current.click()}
                                sx={{
                                    width: '100%',
                                    height: 200,
                                    borderRadius: 2,
                                    borderStyle: 'dashed'
                                }}
                            >
                                <Stack spacing={1} alignItems="center">
                                    <AddIcon />
                                    <Typography>Add Photo or Video</Typography>
                                </Stack>
                            </Button>
                        )}
                        <TextField
                            fullWidth
                            label="Caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            multiline
                            rows={2}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2
                                }
                            }}
                        />
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !storyFile}
                >
                    {isSubmitting ? 'Creating...' : 'Create Story'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const StoryViewer = ({ stories, currentIndex, onClose, onDelete, onNext, onPrevious }) => {
    const theme = useTheme();
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const [progress, setProgress] = useState(0);
    const currentStory = stories[currentIndex];
    const IMAGE_DURATION = 10000; // 10 seconds in milliseconds (changed from 30000)
    const progressInterval = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        // Reset progress when story changes
        setProgress(0);
        
        // Clear previous intervals/timeouts
        if (progressInterval.current) clearInterval(progressInterval.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        // If it's an image, start the progress
        if (currentStory.mediaFile.type.startsWith('image/')) {
            const startTime = Date.now();
            
            // Update progress every 100ms
            progressInterval.current = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const newProgress = (elapsed / IMAGE_DURATION) * 100;
                
                if (newProgress >= 100) {
                    setProgress(100);
                    clearInterval(progressInterval.current);
                    // Move to next story if available
                    if (currentIndex < stories.length - 1) {
                        onNext();
                    } else {
                        onClose();
                    }
                } else {
                    setProgress(newProgress);
                }
            }, 100);

            // Set timeout for story duration
            timeoutRef.current = setTimeout(() => {
                if (currentIndex < stories.length - 1) {
                    onNext();
                } else {
                    onClose();
                }
            }, IMAGE_DURATION);
        }

        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [currentIndex, currentStory, stories.length, onNext, onClose]);

    const handleMenuOpen = (event) => {
        event.stopPropagation();
        setMenuAnchorEl(event.currentTarget);
        // Pause the progress when menu is opened
        if (progressInterval.current) clearInterval(progressInterval.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
        // Resume the progress when menu is closed
        if (currentStory.mediaFile.type.startsWith('image/')) {
            const remaining = IMAGE_DURATION * (1 - progress / 100);
            
            progressInterval.current = setInterval(() => {
                setProgress(prev => {
                    const newProgress = prev + (100 / (remaining / 100));
                    if (newProgress >= 100) {
                        clearInterval(progressInterval.current);
                        if (currentIndex < stories.length - 1) {
                            onNext();
                        } else {
                            onClose();
                        }
                        return 100;
                    }
                    return newProgress;
                });
            }, 100);

            timeoutRef.current = setTimeout(() => {
                if (currentIndex < stories.length - 1) {
                    onNext();
                } else {
                    onClose();
                }
            }, remaining);
        }
    };

    const handleDelete = async () => {
        handleMenuClose();
        if (window.confirm('Are you sure you want to delete this story?')) {
            await onDelete(currentStory.id);
        }
    };

    const handleVideoEnded = () => {
        if (currentIndex < stories.length - 1) {
            onNext();
        } else {
            onClose();
        }
    };

    return (
        <Modal
            open={true}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={true}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        maxWidth: 500,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: 2,
                        outline: 'none',
                    }}
                >
                    <Box sx={{ position: 'relative', width: '100%', height: '80vh', maxHeight: 700 }}>
                        {/* Progress Bar */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: 2,
                                bgcolor: 'rgba(255, 255, 255, 0.3)',
                                zIndex: 2
                            }}
                        >
                            <Box
                                sx={{
                                    height: '100%',
                                    bgcolor: 'white',
                                    width: `${progress}%`,
                                    transition: 'width 0.1s linear'
                                }}
                            />
                        </Box>

                        {/* Story Header */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                p: 2,
                                pt: 3, // Extra padding top to accommodate progress bar
                                zIndex: 1,
                                background: 'linear-gradient(to bottom, rgba(0,0,0,0.5), transparent)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar>{currentStory.username[0]}</Avatar>
                                <Box>
                                    <Typography color="white" variant="subtitle1">
                                        {currentStory.username}
                                    </Typography>
                                    <Typography color="white" variant="caption">
                                        {new Date(currentStory.createdAt).toLocaleString()}
                                    </Typography>
                                </Box>
                            </Stack>
                            <IconButton
                                onClick={handleMenuOpen}
                                sx={{ color: 'white' }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                anchorEl={menuAnchorEl}
                                open={Boolean(menuAnchorEl)}
                                onClose={handleMenuClose}
                            >
                                <MenuItem onClick={handleDelete}>
                                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                                    Delete
                                </MenuItem>
                            </Menu>
                        </Box>

                        {/* Story Content */}
                        <Box
                            sx={{
                                width: '100%',
                                height: '100%',
                                bgcolor: '#000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            {currentStory.mediaFile.type.startsWith('image/') ? (
                                <img
                                    src={currentStory.mediaFile.url}
                                    alt="Story"
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            ) : (
                                <video
                                    src={currentStory.mediaFile.url}
                                    controls
                                    onEnded={handleVideoEnded}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain'
                                    }}
                                />
                            )}
                        </Box>

                        {/* Navigation Buttons */}
                        {currentIndex > 0 && (
                            <IconButton
                                onClick={onPrevious}
                                sx={{
                                    position: 'absolute',
                                    left: 16,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.5)'
                                    }
                                }}
                            >
                                <NavigateBeforeIcon />
                            </IconButton>
                        )}
                        {currentIndex < stories.length - 1 && (
                            <IconButton
                                onClick={onNext}
                                sx={{
                                    position: 'absolute',
                                    right: 16,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                    '&:hover': {
                                        bgcolor: 'rgba(255,255,255,0.5)'
                                    }
                                }}
                            >
                                <NavigateNextIcon />
                            </IconButton>
                        )}

                        {/* Caption */}
                        {currentStory.caption && (
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    p: 2,
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                                }}
                            >
                                <Typography color="white">
                                    {currentStory.caption}
                                </Typography>
                            </Box>
                        )}

                        {/* Close Button */}
                        <IconButton
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                color: 'white',
                                zIndex: 1
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

const StoryCircle = ({ story, isAdd, onClick }) => {
    const theme = useTheme();
    
    return (
        <Box 
            onClick={onClick}
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)'
                }
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    padding: '3px',
                    borderRadius: '50%',
                    background: isAdd ? 'none' : 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                }}
            >
                <Avatar
                    sx={{
                        width: 64,
                        height: 64,
                        border: isAdd ? `2px dashed ${theme.palette.grey[400]}` : '2px solid white',
                        backgroundColor: isAdd ? alpha(theme.palette.primary.main, 0.1) : '#fff'
                    }}
                >
                    {isAdd ? (
                        <AddIcon 
                            sx={{ 
                                color: theme.palette.primary.main,
                                fontSize: 24
                            }} 
                        />
                    ) : story?.mediaFile?.type.startsWith('image/') ? (
                        <img
                            src={story.mediaFile.url}
                            alt={story.username}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    ) : (
                        <VideoCameraBack />
                    )}
                </Avatar>
            </Box>
            <Typography 
                variant="caption" 
                sx={{ 
                    mt: 1,
                    fontWeight: 500,
                    color: theme.palette.text.secondary,
                    transition: 'color 0.2s',
                    '&:hover': {
                        color: theme.palette.primary.main
                    }
                }}
            >
                {isAdd ? 'Add Story' : story.username}
            </Typography>
        </Box>
    );
};

const Comment = ({ comment, postId, onUpdate }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [editContent, setEditContent] = useState(comment.content);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        comment.isEditing = true;
        handleMenuClose();
        onUpdate(postId);
    };

    const handleDelete = async () => {
        handleMenuClose();
        try {
            const updatedPost = await mockApi.deleteComment(postId, comment.id);
            onUpdate(updatedPost);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault();
        if (!editContent.trim() || editContent === comment.content) {
            comment.isEditing = false;
            onUpdate(postId);
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedPost = await mockApi.updateComment(postId, comment.id, editContent.trim());
            onUpdate(updatedPost);
        } catch (error) {
            console.error('Error updating comment:', error);
            comment.isEditing = false;
            onUpdate(postId);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelEdit = () => {
        comment.isEditing = false;
        setEditContent(comment.content);
        onUpdate(postId);
    };

    return (
        <Box sx={{ py: 1 }}>
            <Stack direction="row" spacing={1} alignItems="flex-start">
                <Avatar sx={{ width: 32, height: 32 }}>
                    {comment.username[0].toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    {comment.isEditing ? (
                        <Box component="form" onSubmit={handleSaveEdit}>
                            <TextField
                                fullWidth
                                size="small"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                disabled={isSubmitting}
                                multiline
                                sx={{ mb: 1 }}
                            />
                            <Stack direction="row" spacing={1}>
                                <Button
                                    size="small"
                                    variant="contained"
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Saving...' : 'Save'}
                                </Button>
                                <Button
                                    size="small"
                                    onClick={handleCancelEdit}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Box>
                    ) : (
                        <>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography variant="subtitle2" component="span">
                                    {comment.username}
                                </Typography>
                                <IconButton size="small" onClick={handleMenuOpen}>
                                    <MoreVertIcon fontSize="small" />
                                </IconButton>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                                {comment.content}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </Typography>
                        </>
                    )}
                </Box>
            </Stack>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon fontSize="small" sx={{ mr: 1 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
                    Delete
                </MenuItem>
            </Menu>
        </Box>
    );
};

const EditPostDialog = ({ open, onClose, post, onUpdate }) => {
    const theme = useTheme();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        mediaFiles: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                content: post.content,
                category: post.category,
                mediaFiles: post.mediaFiles || []
            });
        }
    }, [post]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = async (event, fileType) => {
        const files = Array.from(event.target.files);
        const maxFiles = 5 - formData.mediaFiles.length;
        const maxFileSize = 5 * 1024 * 1024; // 5MB

        if (files.length > maxFiles) {
            alert(`You can only add ${maxFiles} more file(s)`);
            return;
        }

        const validFiles = files.filter(file => {
            if (file.size > maxFileSize) {
                alert(`File ${file.name} is too large. Maximum size is 5MB`);
                return false;
            }
            if (fileType === 'image' && !file.type.startsWith('image/')) {
                alert(`File ${file.name} is not an image`);
                return false;
            }
            if (fileType === 'video' && !file.type.startsWith('video/')) {
                alert(`File ${file.name} is not a video`);
                return false;
            }
            return true;
        });

        const newMediaFiles = await Promise.all(
            validFiles.map(async (file) => {
                return new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve({
                            name: file.name,
                            type: file.type,
                            url: reader.result
                        });
                    };
                    reader.readAsDataURL(file);
                });
            })
        );

        setFormData(prev => ({
            ...prev,
            mediaFiles: [...prev.mediaFiles, ...newMediaFiles]
        }));
    };

    const removeFile = (index) => {
        setFormData(prev => ({
            ...prev,
            mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.content.trim() || !formData.category) {
            alert('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            const updatedPost = await mockApi.updatePost(post.id, formData);
            onUpdate(updatedPost);
            onClose();
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
            }}
        >
            <DialogTitle 
                sx={{ 
                    pb: 1,
                    fontWeight: 600
                }}
            >
                Edit Post
            </DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        margin="normal"
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main
                                }
                            }
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        margin="normal"
                        multiline
                        rows={4}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main
                                }
                            }
                        }}
                    />
                    <FormControl 
                        fullWidth 
                        margin="normal"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main
                                }
                            }
                        }}
                    >
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            label="Category"
                        >
                            <MenuItem value="Technology">Technology</MenuItem>
                            <MenuItem value="Design">Design</MenuItem>
                            <MenuItem value="Development">Development</MenuItem>
                            <MenuItem value="Business">Business</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Media Files Section */}
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            Media Files ({formData.mediaFiles.length}/5)
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                                onChange={(e) => handleFileSelect(e, 'image')}
                            />
                            <Button
                                variant="outlined"
                                startIcon={<PhotoCamera />}
                                onClick={() => fileInputRef.current.click()}
                                disabled={formData.mediaFiles.length >= 5}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none'
                                }}
                            >
                                Add Photo
                            </Button>
                            <input
                                type="file"
                                accept="video/*"
                                multiple
                                style={{ display: 'none' }}
                                ref={videoInputRef}
                                onChange={(e) => handleFileSelect(e, 'video')}
                            />
                            <Button
                                variant="outlined"
                                startIcon={<VideoCameraBack />}
                                onClick={() => videoInputRef.current.click()}
                                disabled={formData.mediaFiles.length >= 5}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none'
                                }}
                            >
                                Add Video
                            </Button>
                        </Stack>

                        {formData.mediaFiles.length > 0 && (
                            <ImageList 
                                cols={2} 
                                gap={8}
                                sx={{ 
                                    maxHeight: 300,
                                    borderRadius: 2,
                                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                    p: 1
                                }}
                            >
                                {formData.mediaFiles.map((file, index) => (
                                    <ImageListItem 
                                        key={index}
                                        sx={{ 
                                            position: 'relative',
                                            borderRadius: 1,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {file.type.startsWith('image/') ? (
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                loading="lazy"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        ) : (
                                            <video
                                                src={file.url}
                                                controls
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                        )}
                                        <IconButton
                                            size="small"
                                            onClick={() => removeFile(index)}
                                            sx={{
                                                position: 'absolute',
                                                top: 4,
                                                right: 4,
                                                bgcolor: 'rgba(0, 0, 0, 0.5)',
                                                color: 'white',
                                                '&:hover': {
                                                    bgcolor: 'rgba(0, 0, 0, 0.7)'
                                                }
                                            }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button 
                    onClick={onClose}
                    sx={{
                        color: theme.palette.text.secondary,
                        '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.08)
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 3
                    }}
                >
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

const PostCard = ({ post, onUpdate, onDelete }) => {
    const theme = useTheme();
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleMenuClose();
        setEditDialogOpen(true);
    };

    const handleDelete = async () => {
        handleMenuClose();
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await mockApi.deletePost(post.id);
                onDelete(post.id);
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete post');
            }
        }
    };

    const handleLike = async () => {
        try {
            const updatedPost = await mockApi.toggleLike(post.id);
            onUpdate(updatedPost);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const updatedPost = await mockApi.addComment(post.id, newComment.trim());
            onUpdate(updatedPost);
            setNewComment('');
            setShowComments(true);
        } catch (error) {
            console.error('Error adding comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Card 
                sx={{ 
                    mb: 2,
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.08)'
                    }
                }}
            >
                <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                bgcolor: theme.palette.primary.main,
                                fontSize: '1.2rem',
                                fontWeight: 600
                            }}
                        >
                            {post.id}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography 
                                variant="subtitle1" 
                                sx={{ 
                                    fontWeight: 600,
                                    color: theme.palette.text.primary
                                }}
                            >
                                User_{post.id}
                            </Typography>
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: theme.palette.text.secondary,
                                    display: 'block'
                                }}
                            >
                                {new Date(post.createdAt).toLocaleString()}
                            </Typography>
                        </Box>
                        <IconButton 
                            onClick={handleMenuOpen}
                            sx={{
                                color: theme.palette.text.secondary,
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                    bgcolor: alpha(theme.palette.primary.main, 0.1)
                                }
                            }}
                        >
                            <MoreVertIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{
                                sx: {
                                    mt: 1,
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                    borderRadius: 2
                                }
                            }}
                        >
                            <MenuItem 
                                onClick={handleEdit}
                                sx={{
                                    py: 1,
                                    px: 2,
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.primary.main, 0.08)
                                    }
                                }}
                            >
                                <EditIcon 
                                    fontSize="small" 
                                    sx={{ 
                                        mr: 1.5,
                                        color: theme.palette.text.secondary
                                    }} 
                                />
                                Edit
                            </MenuItem>
                            <MenuItem 
                                onClick={handleDelete}
                                sx={{
                                    py: 1,
                                    px: 2,
                                    color: theme.palette.error.main,
                                    '&:hover': {
                                        bgcolor: alpha(theme.palette.error.main, 0.08)
                                    }
                                }}
                            >
                                <DeleteIcon 
                                    fontSize="small" 
                                    sx={{ 
                                        mr: 1.5,
                                        color: 'inherit'
                                    }} 
                                />
                                Delete
                            </MenuItem>
                        </Menu>
                    </Stack>

                    <Typography 
                        variant="h6" 
                        gutterBottom
                        sx={{ 
                            fontWeight: 600,
                            color: theme.palette.text.primary,
                            mb: 2
                        }}
                    >
                        {post.title}
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            color: theme.palette.text.secondary,
                            mb: 3,
                            lineHeight: 1.6
                        }}
                    >
                        {post.content}
                    </Typography>
                    
                    {post.mediaFiles && post.mediaFiles.length > 0 && (
                        <Box sx={{ mb: 3 }}>
                            <ImageList 
                                cols={post.mediaFiles.length > 1 ? 2 : 1} 
                                gap={12}
                                sx={{ borderRadius: 2, overflow: 'hidden' }}
                            >
                                {post.mediaFiles.map((file, index) => (
                                    <ImageListItem 
                                        key={index}
                                        sx={{ 
                                            overflow: 'hidden',
                                            '&:hover img, &:hover video': {
                                                transform: 'scale(1.05)'
                                            }
                                        }}
                                    >
                                        {file.type.startsWith('image/') ? (
                                            <img
                                                src={file.url}
                                                alt={file.name}
                                                loading="lazy"
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                            />
                                        ) : (
                                            <video
                                                src={file.url}
                                                controls
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.3s ease'
                                                }}
                                            />
                                        )}
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Box>
                    )}

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                        <Chip 
                            label={post.category} 
                            size="small" 
                            sx={{ 
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: theme.palette.primary.main,
                                fontWeight: 500,
                                '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.2)
                                }
                            }} 
                        />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Stack direction="row" spacing={3} alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <IconButton 
                                onClick={handleLike}
                                sx={{
                                    color: post.liked ? theme.palette.error.main : theme.palette.text.secondary,
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        color: theme.palette.error.main
                                    }
                                }}
                            >
                                {post.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            </IconButton>
                            <Typography 
                                variant="body2"
                                sx={{ 
                                    color: post.liked ? theme.palette.error.main : theme.palette.text.secondary,
                                    fontWeight: 500
                                }}
                            >
                                {post.likes}
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <IconButton 
                                onClick={() => setShowComments(!showComments)}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        color: theme.palette.primary.main,
                                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                                    }
                                }}
                            >
                                <ChatBubbleOutlineIcon />
                            </IconButton>
                            <Typography 
                                variant="body2"
                                sx={{ 
                                    color: theme.palette.text.secondary,
                                    fontWeight: 500
                                }}
                            >
                                {post.comments.length}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Collapse in={showComments}>
                        <Box sx={{ mt: 3 }}>
                            {post.comments.map((comment) => (
                                <Comment
                                    key={comment.id}
                                    comment={comment}
                                    postId={post.id}
                                    onUpdate={onUpdate}
                                />
                            ))}
                            <Box 
                                component="form" 
                                onSubmit={handleComment} 
                                sx={{ 
                                    mt: 2,
                                    display: 'flex',
                                    gap: 1
                                }}
                            >
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Add a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    disabled={isSubmitting}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2,
                                            '&:hover fieldset': {
                                                borderColor: theme.palette.primary.main
                                            }
                                        }
                                    }}
                                />
                                <Button 
                                    type="submit"
                                    variant="contained"
                                    disabled={isSubmitting || !newComment.trim()}
                                    sx={{ 
                                        minWidth: 100,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    {isSubmitting ? 'Posting...' : 'Post'}
                                </Button>
                            </Box>
                        </Box>
                    </Collapse>
                </CardContent>
            </Card>
            <EditPostDialog
                open={editDialogOpen}
                onClose={() => setEditDialogOpen(false)}
                post={post}
                onUpdate={onUpdate}
            />
        </>
    );
};

const Home = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [posts, setPosts] = useState([]);
    const [stories, setStories] = useState([]);
    const [addStoryDialogOpen, setAddStoryDialogOpen] = useState(false);
    const [selectedStoryIndex, setSelectedStoryIndex] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const data = await mockApi.getPosts();
                setPosts(data);
                // Fetch or initialize stories
                const mockStories = []; // You would typically fetch this from your API
                setStories(mockStories);
            } catch (err) {
                setError('Failed to load posts');
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handlePostUpdate = (updatedPost) => {
        setPosts(posts.map(post => 
            post.id === updatedPost.id ? updatedPost : post
        ));
    };

    const handlePostDelete = (postId) => {
        setPosts(posts.filter(post => post.id !== postId));
    };

    const handleAddStory = async (newStory) => {
        try {
            // In a real app, you would make an API call here
            setStories(prev => [newStory, ...prev]);
        } catch (error) {
            console.error('Error adding story:', error);
            alert('Failed to add story');
        }
    };

    const handleDeleteStory = async (storyId) => {
        try {
            // In a real app, you would make an API call here
            setStories(prev => prev.filter(story => story.id !== storyId));
            setSelectedStoryIndex(null);
        } catch (error) {
            console.error('Error deleting story:', error);
            alert('Failed to delete story');
        }
    };

    const handleStoryClick = (index) => {
        setSelectedStoryIndex(index);
    };

    return (
        <Container 
            maxWidth="md" 
            sx={{ 
                py: 4,
                minHeight: '100vh',
                bgcolor: alpha(theme.palette.primary.main, 0.02)
            }}
        >
            {/* Stories Section */}
            <Paper 
                elevation={0} 
                sx={{ 
                    p: 3, 
                    mb: 4, 
                    backgroundColor: '#fff',
                    borderRadius: 3,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
                }}
            >
                <Stack
                    direction="row"
                    spacing={4}
                    sx={{
                        overflowX: 'auto',
                        pb: 1,
                        '&::-webkit-scrollbar': {
                            height: '6px'
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            borderRadius: '3px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.2),
                            borderRadius: '3px',
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.3)
                            }
                        }
                    }}
                >
                    <StoryCircle
                        isAdd={true}
                        onClick={() => setAddStoryDialogOpen(true)}
                    />
                    {stories.map((story, index) => (
                        <StoryCircle
                            key={story.id}
                            story={story}
                            onClick={() => handleStoryClick(index)}
                        />
                    ))}
                </Stack>
            </Paper>

            <Box sx={{ mt: 4 }}>
                {loading ? (
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            justifyContent: 'center',
                            alignItems: 'center',
                            minHeight: 200
                        }}
                    >
                        <CircularProgress 
                            size={40}
                            sx={{ color: theme.palette.primary.main }}
                        />
                    </Box>
                ) : error ? (
                    <Typography 
                        color="error" 
                        align="center" 
                        sx={{ 
                            py: 4,
                            fontWeight: 500
                        }}
                    >
                        {error}
                    </Typography>
                ) : posts.length === 0 ? (
                    <Box
                        sx={{
                            py: 8,
                            textAlign: 'center',
                            color: theme.palette.text.secondary
                        }}
                    >
                        <Typography 
                            variant="h6"
                            sx={{ 
                                mb: 1,
                                fontWeight: 500
                            }}
                        >
                            No posts yet
                        </Typography>
                        <Typography variant="body2">
                            Be the first one to share something!
                        </Typography>
                    </Box>
                ) : (
                    <Stack spacing={3}>
                        {posts.map((post) => (
                            <PostCard 
                                key={post.id} 
                                post={post} 
                                onUpdate={handlePostUpdate}
                                onDelete={handlePostDelete}
                            />
                        ))}
                    </Stack>
                )}
            </Box>

            {/* Dialogs */}
            <AddStoryDialog
                open={addStoryDialogOpen}
                onClose={() => setAddStoryDialogOpen(false)}
                onSave={handleAddStory}
            />
            {selectedStoryIndex !== null && (
                <StoryViewer
                    stories={stories}
                    currentIndex={selectedStoryIndex}
                    onClose={() => setSelectedStoryIndex(null)}
                    onDelete={handleDeleteStory}
                    onNext={() => setSelectedStoryIndex(prev => Math.min(prev + 1, stories.length - 1))}
                    onPrevious={() => setSelectedStoryIndex(prev => Math.max(prev - 1, 0))}
                />
            )}
        </Container>
    );
};

export default Home; 