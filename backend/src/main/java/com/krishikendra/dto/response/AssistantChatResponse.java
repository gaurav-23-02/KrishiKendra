package com.krishikendra.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class AssistantChatResponse {
    private String reply;
    private String intent;
    private List<String> sourcesUsed;
    private List<String> suggestedQuestions;
    private LocalDateTime timestamp;

    public AssistantChatResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public AssistantChatResponse(String reply, String intent, List<String> sourcesUsed, List<String> suggestedQuestions) {
        this.reply = reply;
        this.intent = intent;
        this.sourcesUsed = sourcesUsed;
        this.suggestedQuestions = suggestedQuestions;
        this.timestamp = LocalDateTime.now();
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public List<String> getSourcesUsed() {
        return sourcesUsed;
    }

    public void setSourcesUsed(List<String> sourcesUsed) {
        this.sourcesUsed = sourcesUsed;
    }

    public List<String> getSuggestedQuestions() {
        return suggestedQuestions;
    }

    public void setSuggestedQuestions(List<String> suggestedQuestions) {
        this.suggestedQuestions = suggestedQuestions;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
