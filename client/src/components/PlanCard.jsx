// src/components/PlanCard.jsx
import React from 'react';
import { Card, CardContent, Typography, IconButton, LinearProgress, Stack, Tooltip } from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import './PlanCard.css';

export default function PlanCard({ plan, onDelete }) {
  const navigate = useNavigate();

  // Calculate progress based on timeline
  const startDate = plan.createdAt || plan.startDate || plan.updatedAt || dayjs();
  const endDate = dayjs(plan.timeline);
  const totalDuration = endDate.diff(dayjs(startDate), 'day');
  const remaining = endDate.diff(dayjs(), 'day');
  const progress = totalDuration > 0 ? Math.max(0, Math.min(100, 100 - (remaining / totalDuration) * 100)) : 0;

  const handleEdit = () => {
    navigate(`/plan/${plan.id}`);
  };

  return (
    <Card className="plan-card">
  <CardContent>
    <Typography className="plan-card-title" variant="h6" gutterBottom>{plan.title}</Typography>
    <Typography className="plan-card-text" variant="body2">
      Topics: {plan.topics?.join(', ') || 'None'}
    </Typography>
    <Typography className="plan-card-text" variant="body2">
      Resources: {plan.resources?.join(', ') || 'None'}
    </Typography>
    <Typography className="plan-card-text" variant="body2">
      Timeline: {plan.timeline}
    </Typography>

    <LinearProgress
      variant="determinate"
      value={progress}
      className="plan-progress-bar"
    />
    <Typography className="plan-progress-text" variant="caption">
      Progress: {`${Math.round(progress)}%`}
    </Typography>

    <div className="plan-action-buttons">
      <Tooltip title="Edit">
        <IconButton onClick={handleEdit}><Edit /></IconButton>
      </Tooltip>
      <Tooltip title="Delete">
        <IconButton color="error" onClick={() => onDelete(plan.id)}><Delete /></IconButton>
      </Tooltip>
    </div>
  </CardContent>
</Card>

  );
}
