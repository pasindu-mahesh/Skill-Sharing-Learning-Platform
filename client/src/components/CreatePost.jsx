import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    TextField, Button, Paper, Typography, Container, Box,
    Select, MenuItem, Stack, Snackbar, Alert, CircularProgress,
    IconButton, ImageList, ImageListItem, FormControl, InputLabel
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VideocamIcon from '@mui/icons-material/Videocam';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import { mockApi } from '../services/mockApi';

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const CreatePost = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
        mediaFiles: []
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [previews, setPreviews] = useState([]);

    const categories = [
        'Landscape Photography',
        'Wildlife Photography',
        'Street Photography',
        'Fashion Photography'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = (type) => {
        if (formData.mediaFiles.length >= MAX_FILES) {
            setError(`You can only upload up to ${MAX_FILES} files`);
            return;
        }

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = type === 'photo' ? 'image/*' : 'video/*';
        input.multiple = true;

        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            const validFiles = [];
            const invalidFiles = [];

            for (const file of files) {
                if (file.size > MAX_FILE_SIZE) {
                    invalidFiles.push(file.name);
                    continue;
                }
                if (formData.mediaFiles.length + validFiles.length >= MAX_FILES) break;
                validFiles.push(file);

                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreviews(prev => [...prev, {
                        url: e.target.result,
                        type: file.type,
                        name: file.name
                    }]);
                };
                reader.readAsDataURL(file);
            }

            if (invalidFiles.length > 0) {
                setError(`Files too large: ${invalidFiles.join(', ')}`);
            }

            setFormData(prev => ({
                ...prev,
                mediaFiles: [...prev.mediaFiles, ...validFiles]
            }));
        };

        input.click();
    };

    const removeFile = (index) => {
        setFormData(prev => ({
            ...prev,
            mediaFiles: prev.mediaFiles.filter((_, i) => i !== index)
        }));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.title.trim()) {
            setError('Please enter a title');
            setLoading(false);
            return;
        }

        if (!formData.content) {
            setError('Please enter some content');
            setLoading(false);
            return;
        }

        if (!formData.category) {
            setError('Please select a category');
            setLoading(false);
            return;
        }

        try {
            await mockApi.createPost(formData);
            navigate('/');
        } catch (err) {
            setError('Failed to create post. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" className="fade-in">
            <Paper elevation={1} sx={{ p: 3, mt: 4, borderRadius: 2, border: '1px solid #e0e0e0' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#411D87' }}>
                    Create Skill-Sharing Post
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<PhotoCameraIcon />}
                        onClick={() => handleFileSelect('photo')}
                        sx={{
                            borderColor: '#B195EA',
                            color: '#411D87',
                            '&:hover': {
                                backgroundColor: '#f3effd',
                                borderColor: '#411D87'
                            }
                        }}
                    >
                        Photo Post
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<VideocamIcon />}
                        onClick={() => handleFileSelect('video')}
                        sx={{
                            borderColor: '#B195EA',
                            color: '#411D87',
                            '&:hover': {
                                backgroundColor: '#f3effd',
                                borderColor: '#411D87'
                            }
                        }}
                    >
                        Video Post
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<MoreHorizIcon />}
                        sx={{
                            borderColor: '#B195EA',
                            color: '#411D87',
                            '&:hover': {
                                backgroundColor: '#f3effd',
                                borderColor: '#411D87'
                            }
                        }}
                    >
                        Other Options
                    </Button>
                </Stack>

                {previews.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <ImageList cols={3} rowHeight={164} gap={8}>
                            {previews.map((preview, index) => (
                                <ImageListItem key={index} sx={{ position: 'relative' }}>
                                    {preview.type.startsWith('image/') ? (
                                        <img src={preview.url} alt={preview.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} />
                                    ) : (
                                        <video src={preview.url} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }} controls />
                                    )}
                                    <IconButton
                                        size="small"
                                        onClick={() => removeFile(index)}
                                        sx={{ position: 'absolute', top: 4, right: 4, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </ImageListItem>
                            ))}
                        </ImageList>
                        <Typography variant="caption" color="textSecondary">
                            {MAX_FILES - formData.mediaFiles.length} files remaining
                        </Typography>
                    </Box>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="category-label">Select Photography Category</InputLabel>
                        <Select
                            labelId="category-label"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            label="Select Photography Category"
                            sx={{ backgroundColor: '#f8f9fa' }}
                            error={error === 'Please select a category'}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category} value={category}>{category}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        placeholder="What's your skill or tip?"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        variant="outlined"
                        error={error === 'Please enter a title'}
                        helperText={error === 'Please enter a title' ? error : ''}
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: '#f8f9fa' } }}
                    />

                    <TextField
                        fullWidth
                        placeholder="Share your knowledge and experience..."
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        variant="outlined"
                        multiline
                        rows={4}
                        error={error === 'Please enter some content'}
                        helperText={error === 'Please enter some content' ? error : ''}
                        sx={{ mb: 2, '& .MuiOutlinedInput-root': { backgroundColor: '#f8f9fa' } }}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{
                            mt: 1,
                            textTransform: 'none',
                            backgroundColor: '#411D87',
                            '&:hover': { backgroundColor: '#311368' }
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
                    </Button>
                </Box>
            </Paper>

            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={() => setError('')}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CreatePost;
