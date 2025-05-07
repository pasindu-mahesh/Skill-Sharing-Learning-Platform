// src/components/LearningPlanForm.jsx
import { useEffect, useState } from 'react';
import { TextField, Button, Paper, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createPlan, getPlans, updatePlan } from '../api';
import './LearningPlanForm.css';

function LearningPlanForm({ planId, initialData, onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    topics: '',
    resources: '',
    timeline: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Fetch data by planId if no initialData prop is passed
  useEffect(() => {
    if (planId && !initialData) {
      getPlans().then(res => {
        const plan = res.data.find(p => p.id === planId);
        if (plan) {
          setForm({
            title: plan.title,
            topics: (plan.topics || []).join(', '),
            resources: (plan.resources || []).join(', '),
            timeline: plan.timeline,
          });
        }
      });
    } else if (initialData) {
      setForm({
        title: initialData.title || '',
        topics: (initialData.topics || []).join(', '),
        resources: (initialData.resources || []).join(', '),
        timeline: initialData.timeline || '',
      });
    }
  }, [planId, initialData]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error for field
  };

  const validateForm = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.topics.trim()) errs.topics = 'At least one topic is required';
    if (!form.timeline.trim()) errs.timeline = 'Timeline is required';
    return errs;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      title: form.title.trim(),
      topics: form.topics.split(',').map(t => t.trim()),
      resources: form.resources.split(',').map(r => r.trim()),
      timeline: form.timeline,
    };

    try {
      if (onSubmit) {
        onSubmit(payload);
      } else if (planId) {
        await updatePlan(planId, payload);
        navigate('/');
      } else {
        await createPlan(payload);
        navigate('/');
      }
    } catch (err) {
      alert('Something went wrong!');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        {planId || initialData ? 'Edit Learning Plan' : 'Create New Learning Plan'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            required
          />
          <TextField
            label="Topics (comma separated)"
            name="topics"
            value={form.topics}
            onChange={handleChange}
            error={!!errors.topics}
            helperText={errors.topics}
            required
          />
          <TextField
            label="Resources (comma separated)"
            name="resources"
            value={form.resources}
            onChange={handleChange}
          />
          <TextField
            label="Timeline"
            type="date"
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            error={!!errors.timeline}
            helperText={errors.timeline}
            InputLabelProps={{ shrink: true }}
            required
          />
          <Button type="submit" variant="contained">
            {planId || initialData ? 'Update Plan' : 'Create Plan'}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}

export default LearningPlanForm;
