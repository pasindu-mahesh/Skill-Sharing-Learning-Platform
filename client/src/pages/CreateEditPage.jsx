import React, { useEffect, useState } from 'react';
import { Container, Typography } from '@mui/material';
import LearningPlanForm from '../components/LearningPlanForm';
import PlanCard from '../components/PlanCard';
import { getPlans, createPlan, updatePlan, deletePlan } from '../api';
import './CreateEditPage.css';

export default function CreateEditPage() {
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const res = await getPlans();
    setPlans(res.data);
  };

  const handleCreate = async (newData) => {
    const res = await createPlan(newData);
    setPlans([res.data, ...plans]); // Add new plan to top
  };

  const handleUpdate = async (id, updatedData) => {
    const res = await updatePlan(id, updatedData);
    setPlans(plans.map(plan => plan.id === id ? res.data : plan));
    setEditingPlan(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this plan?")) {
      await deletePlan(id);
      setPlans(plans.filter(plan => plan.id !== id));
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container className="create-edit-container">
  <Typography variant="h4" gutterBottom>Learning Plans</Typography>

  <LearningPlanForm
    onSubmit={editingPlan ? (data) => handleUpdate(editingPlan.id, data) : handleCreate}
    initialData={editingPlan}
  />

  <div className="plan-card-list">
    {plans.map(plan => (
      <PlanCard
        key={plan.id}
        plan={plan}
        onEdit={() => handleEdit(plan)}
        onDelete={() => handleDelete(plan.id)}
      />
    ))}
  </div>
</Container>

  );
}
