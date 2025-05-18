package com.learning.plans_demo.repository;

import com.learning.plans_demo.model.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LearningPlanRepository extends JpaRepository<LearningPlan, Long> {
}
