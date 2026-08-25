package com.krishikendra.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "news_articles", indexes = {
    @Index(name = "idx_news_category", columnList = "category"),
    @Index(name = "idx_news_published", columnList = "published_at")
})
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(nullable = false, length = 2000)
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false)
    private String source = "Krishi Kendra Advisory";

    @Column(name = "source_url", length = 500)
    private String sourceUrl;

    @Column(nullable = false)
    private String category;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "published_at", nullable = false)
    private LocalDateTime publishedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (publishedAt == null) {
            publishedAt = LocalDateTime.now();
        }
    }

    public News() {
    }

    public News(String title, String summary, String content, String source, String sourceUrl, String category, String imageUrl, LocalDateTime publishedAt) {
        this.title = title;
        this.summary = summary;
        this.content = content;
        this.source = source != null ? source : "Krishi Kendra Advisory";
        this.sourceUrl = sourceUrl;
        this.category = category;
        this.imageUrl = imageUrl;
        this.publishedAt = publishedAt != null ? publishedAt : LocalDateTime.now();
    }

    // Getters and Setters
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
