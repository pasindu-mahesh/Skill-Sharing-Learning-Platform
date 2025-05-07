// src/pages/DashboardPage.jsx
import { useEffect, useState } from 'react';
import { getPlans, deletePlan } from '../api';
import PlanCard from '../components/PlanCard';
import { Button, Container, Typography, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './DashboardPage.css';

function DashboardPage() {
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPlans().then(res => setPlans(res.data));
  }, []);

  const handleDelete = (id) => {
    deletePlan(id).then(() => setPlans(plans.filter(p => p.id !== id)));
  };

  const calendarEvents = plans.map(plan => ({
    title: plan.title,
    date: plan.timeline, // Format: 'YYYY-MM-DD'
    id: plan.id,
  }));

  return (
    <Container className="dashboard-container">
      <div className="dashboard-header">
        <Typography variant="h4" gutterBottom>📘 Learning Plans</Typography>
        <Button
          variant="contained"
          className="new-plan-button"
          onClick={() => navigate('/plan')}
        >
          + New Plan
        </Button>
      </div>

      {/* Calendar View */}
      <Box className="calendar-section">
        <Typography variant="h6" className="section-title">📅 Calendar View</Typography>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          eventClick={info => navigate(`/plan/${info.event.id}`)}
          height="auto"
          contentHeight="auto"
          aspectRatio={2}
          eventDisplay="block"
        />
      </Box>

      {/* Plan Cards View */}
      <Typography variant="h6" className="section-title" style={{ marginTop: '3rem' }}>
        🗂️ Your Learning Plans
      </Typography>
      <Grid container spacing={3} className="plan-grid">
        {plans.map(plan => (
          <Grid item xs={12} sm={6} md={4} key={plan.id}>
            <PlanCard plan={plan} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default DashboardPage;
