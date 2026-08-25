package com.krishikendra.dto.response;

import java.time.LocalDate;

public class SchemeResponse {
    private Long id;
    private String name;
    private String description;
    private String eligibility;
    private String benefits;
    private String applicationProcess;
    private String category;
    private String state;
    private String officialUrl;
    private LocalDate lastUpdated;

    public SchemeResponse() {
    }

    public SchemeResponse(Long id, String name, String description, String eligibility, String benefits, String applicationProcess, String category, String state, String officialUrl, LocalDate lastUpdated) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.eligibility = eligibility;
        this.benefits = benefits;
        this.applicationProcess = applicationProcess;
        this.category = category;
        this.state = state;
        this.officialUrl = officialUrl;
        this.lastUpdated = lastUpdated;
    }

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
}
