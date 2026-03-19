package com.example.jobtracker.api;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.jobtracker.model.ApplicationSource;
import com.example.jobtracker.model.ApplicationStatus;
import com.example.jobtracker.model.JobApplication;
import com.example.jobtracker.repo.JobApplicationRepository;

import jakarta.validation.Valid;

/**
 * REST controller for creating and viewing job applications.
 */
@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationRepository repo;

    public JobApplicationController(JobApplicationRepository repo) {
        this.repo = repo;
    }

    @PostMapping
    public JobApplication create(@Valid @RequestBody JobApplication application) {
        if (application.getDateApplied() == null) {
            application.setDateApplied(LocalDate.now());
        }
        if (application.getStatus() == null) {
            application.setStatus(ApplicationStatus.APPLIED);
        }
        return repo.save(application);
    }

   @GetMapping
    public List<JobApplication> getAll(
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) ApplicationSource source) {

        if (status != null && source != null) {
            return repo.findByStatusAndSource(status, source);
        } else if (status != null) {
            return repo.findByStatus(status);
        } else if (source != null) {
            return repo.findBySource(source);
        } else {
        return repo.findAll();
    }
}
    
    @GetMapping("/{id}")
    public JobApplication getById(@PathVariable Long id) {
    return repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));
    }

    @PutMapping("/{id}")
    public JobApplication update(@PathVariable Long id, @Valid @RequestBody JobApplication updatedApplication) {
    JobApplication existingApplication = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));

    existingApplication.setCompany(updatedApplication.getCompany());
    existingApplication.setJobTitle(updatedApplication.getJobTitle());
    existingApplication.setLocation(updatedApplication.getLocation());
    existingApplication.setSource(updatedApplication.getSource());
    existingApplication.setDateApplied(updatedApplication.getDateApplied());
    existingApplication.setStatus(updatedApplication.getStatus());
    existingApplication.setJobLink(updatedApplication.getJobLink());
    existingApplication.setFollowUpDate(updatedApplication.getFollowUpDate());
    existingApplication.setNotes(updatedApplication.getNotes());

    return repo.save(existingApplication);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
    JobApplication existingApplication = repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));

    repo.delete(existingApplication);
    return "Application deleted with id: " + id;
    }
}
