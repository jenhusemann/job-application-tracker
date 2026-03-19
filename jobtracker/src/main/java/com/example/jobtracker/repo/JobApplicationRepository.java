package com.example.jobtracker.repo;

import com.example.jobtracker.model.ApplicationSource;
import com.example.jobtracker.model.ApplicationStatus;
import com.example.jobtracker.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository interface for JobApplication entity.
 * Provides built-in CRUD operations via JPA.
 */
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByStatus(ApplicationStatus status);

    List<JobApplication> findBySource(ApplicationSource source);

    List<JobApplication> findByStatusAndSource(ApplicationStatus status, ApplicationSource source);
}
