package com.krishikendra.dto.response;

import java.time.LocalDateTime;

public class NewsResponse {
    private Long id;
    private String title;
    private String summary;
    private String content;
    private String source;
    private String sourceUrl;
    private String category;
    private String imageUrl;
    private LocalDateTime publishedAt;

    public NewsResponse() {
    }

    public NewsResponse(Long id, String title, String summary, String content, String source, String sourceUrl, String category, String imageUrl, LocalDateTime publishedAt) {
        this.id = id;
        this.title = title;
        this.summary = summary;
        this.content = content;
        this.source = source;
        this.sourceUrl = sourceUrl;
        this.category = category;
        this.imageUrl = imageUrl;
        this.publishedAt = publishedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getSourceUrl() {
        return sourceUrl;
    }

    public void setSourceUrl(String sourceUrl) {
        this.sourceUrl = sourceUrl;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }
}
