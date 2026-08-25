package com.krishikendra.service;

import com.krishikendra.dto.request.NewsRequest;
import com.krishikendra.dto.response.NewsResponse;
import com.krishikendra.dto.response.PagedResponse;
import com.krishikendra.entity.News;
import com.krishikendra.exception.ResourceNotFoundException;
import com.krishikendra.repository.NewsRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NewsService {

    private final NewsRepository newsRepository;

    public NewsService(NewsRepository newsRepository) {
        this.newsRepository = newsRepository;
    }

    public PagedResponse<NewsResponse> filterNews(String category, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<News> results = newsRepository.filterNews(
                cleanParam(category),
                cleanParam(query),
                pageable);

        List<NewsResponse> list = results.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                list,
                results.getNumber(),
                results.getSize(),
                results.getTotalElements(),
                results.getTotalPages(),
                results.isLast()
        );
    }

    public NewsResponse getNewsById(Long id) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with id: " + id));
        return mapToResponse(news);
    }

    public List<NewsResponse> getRecentNews(int limit) {
        return newsRepository.findTop5ByOrderByPublishedAtDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Cacheable("newsCategories")
    public List<String> getDistinctCategories() {
        return newsRepository.findDistinctCategories();
    }

    @Transactional
    @CacheEvict(value = "newsCategories", allEntries = true)
    public NewsResponse createNews(NewsRequest request) {
        News news = new News(
                request.getTitle().trim(),
                request.getSummary().trim(),
                request.getContent() != null ? request.getContent().trim() : null,
                request.getSource() != null ? request.getSource().trim() : "Krishi Kendra Advisory",
                request.getSourceUrl() != null ? request.getSourceUrl().trim() : null,
                request.getCategory().trim(),
                request.getImageUrl() != null ? request.getImageUrl().trim() : null,
                LocalDateTime.now()
        );
        News saved = newsRepository.save(news);
        return mapToResponse(saved);
    }

    @Transactional
    @CacheEvict(value = "newsCategories", allEntries = true)
    public NewsResponse updateNews(Long id, NewsRequest request) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with id: " + id));

        news.setTitle(request.getTitle().trim());
        news.setSummary(request.getSummary().trim());
        news.setContent(request.getContent() != null ? request.getContent().trim() : null);
        news.setSource(request.getSource() != null ? request.getSource().trim() : "Krishi Kendra Advisory");
        news.setSourceUrl(request.getSourceUrl() != null ? request.getSourceUrl().trim() : null);
        news.setCategory(request.getCategory().trim());
        news.setImageUrl(request.getImageUrl() != null ? request.getImageUrl().trim() : null);

        News updated = newsRepository.save(news);
        return mapToResponse(updated);
    }

    @Transactional
    @CacheEvict(value = "newsCategories", allEntries = true)
    public void deleteNews(Long id) {
        if (!newsRepository.existsById(id)) {
            throw new ResourceNotFoundException("News article not found with id: " + id);
        }
        newsRepository.deleteById(id);
    }

    public NewsResponse mapToResponse(News n) {
        return new NewsResponse(
                n.getId(),
                n.getTitle(),
                n.getSummary(),
                n.getContent(),
                n.getSource(),
                n.getSourceUrl(),
                n.getCategory(),
                n.getImageUrl(),
                n.getPublishedAt()
        );
    }

    private String cleanParam(String val) {
        return (val != null && !val.isBlank() && !val.equalsIgnoreCase("all")) ? val.trim() : null;
    }
}
