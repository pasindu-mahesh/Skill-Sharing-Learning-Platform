package com.learning.plans_demo.controller;

import com.learning.plans_demo.model.LearningPlan;
import com.learning.plans_demo.service.LearningPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
@CrossOrigin(origins = "*")
public class LearningPlanController {

    @Autowired
    private LearningPlanService service;

    @GetMapping
    public List<LearningPlan> getAllPlans() {
        return service.getAllPlans();
    }

    @GetMapping("/{id}")
    public LearningPlan getPlanById(@PathVariable Long id) {
        return service.getPlanById(id);
    }

    @PostMapping
    public LearningPlan createPlan(@RequestBody LearningPlan plan) {
        return service.createPlan(plan);
    }

    @PutMapping("/{id}")
    public LearningPlan updatePlan(@PathVariable Long id, @RequestBody LearningPlan plan) {
        return service.updatePlan(id, plan);
    }

    @DeleteMapping("/{id}")
    public void deletePlan(@PathVariable Long id) {
        service.deletePlan(id);
    }
}
