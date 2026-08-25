package com.krishikendra.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AssistantChatRequest {

    @NotBlank(message = "Question/message is required")
    private String message;

    private String state;
    private String district;
    private String preferredLanguage;

    public AssistantChatRequest() {
    }

    public AssistantChatRequest(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getPreferredLanguage() {
        return preferredLanguage;
    }

    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }
}
