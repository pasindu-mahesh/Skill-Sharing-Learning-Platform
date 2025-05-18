package com.learning.plans_demo.service;

import com.learning.plans_demo.model.LearningPlan;
import com.learning.plans_demo.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearningPlanService {

    @Autowired
    private LearningPlanRepository repository;

    public List<LearningPlan> getAllPlans() {
        return repository.findAll();
    }

    public LearningPlan getPlanById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public LearningPlan createPlan(LearningPlan plan) {
        return repository.save(plan);
    }

    public LearningPlan updatePlan(Long id, LearningPlan updatedPlan) {
        return repository.findById(id).map(plan -> {
            plan.setTitle(updatedPlan.getTitle());
            plan.setDescription(updatedPlan.getDescription());
            plan.setStartDate(updatedPlan.getStartDate());
            plan.setEndDate(updatedPlan.getEndDate());
            return repository.save(plan);
        }).orElse(null);
    }

    public void deletePlan(Long id) {
        repository.deleteById(id);
    }
}
