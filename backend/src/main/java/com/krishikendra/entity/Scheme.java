package com.krishikendra.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "schemes", indexes = {
    @Index(name = "idx_scheme_category", columnList = "category"),
    @Index(name = "idx_scheme_state", columnList = "state")
})
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 3000)
    private String description;

    @Column(nullable = false, length = 3000)
    private String eligibility;

    @Column(nullable = false, length = 3000)
    private String benefits;

    @Column(name = "application_process", nullable = false, length = 3000)
    private String applicationProcess;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String state = "Central"; // "Central" or State name

    @Column(name = "official_url", length = 500)
    private String officialUrl;

    @Column(name = "last_updated")
    private LocalDate lastUpdated;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (lastUpdated == null) {
            lastUpdated = LocalDate.now();
        }
    }

    public Scheme() {
    }

    public Scheme(String name, String description, String eligibility, String benefits, String applicationProcess, String category, String state, String officialUrl, LocalDate lastUpdated) {
        this.name = name;
        this.description = description;
        this.eligibility = eligibility;
        this.benefits = benefits;
        this.applicationProcess = applicationProcess;
        this.category = category;
        this.state = state != null ? state : "Central";
        this.officialUrl = officialUrl;
        this.lastUpdated = lastUpdated != null ? lastUpdated : LocalDate.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEligibility() {
        return eligibility;
    }

    public void setEligibility(String eligibility) {
        this.eligibility = eligibility;
    }

    public String getBenefits() {
        return benefits;
    }

    public void setBenefits(String benefits) {
        this.benefits = benefits;
    }

    public String getApplicationProcess() {
        return applicationProcess;
    }

    public void setApplicationProcess(String applicationProcess) {
        this.applicationProcess = applicationProcess;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getOfficialUrl() {
        return officialUrl;
    }

    public void setOfficialUrl(String officialUrl) {
        this.officialUrl = officialUrl;
    }

    public LocalDate getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDate lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
