package com.krishikendra.service;

import com.krishikendra.dto.request.NewsRequest;
import com.krishikendra.dto.response.NewsResponse;
import com.krishikendra.dto.response.PagedResponse;
import com.krishikendra.entity.News;
import com.krishikendra.repository.NewsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NewsServiceTest {

    @Mock
    private NewsRepository newsRepository;

    @InjectMocks
    private NewsService newsService;

    private News sampleNews;

    @BeforeEach
    void setUp() {
        sampleNews = new News(
                "MSP Hike for Wheat",
                "Cabinet increases MSP",
                "Detailed content",
                "Govt Source",
                "https://pib.gov.in",
                "Government",
                null,
                LocalDateTime.now()
        );
        sampleNews.setId(1L);
    }

    @Test
    void filterNews_ReturnsPagedResponse() {
        Page<News> page = new PageImpl<>(List.of(sampleNews));
        when(newsRepository.filterNews(isNull(), isNull(), any(Pageable.class))).thenReturn(page);

        PagedResponse<NewsResponse> response = newsService.filterNews(null, null, 0, 10);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals("MSP Hike for Wheat", response.getContent().get(0).getTitle());
    }

    @Test
    void getNewsById_Success() {
        when(newsRepository.findById(1L)).thenReturn(Optional.of(sampleNews));

        NewsResponse response = newsService.getNewsById(1L);

        assertNotNull(response);
        assertEquals("MSP Hike for Wheat", response.getTitle());
    }

    @Test
    void createNews_SavesAndReturns() {
        NewsRequest req = new NewsRequest();
        req.setTitle("Monsoon Update");
        req.setSummary("Rainfall update");
        req.setCategory("Weather");
        req.setSource("IMD");

        when(newsRepository.save(any(News.class))).thenAnswer(invocation -> {
            News n = invocation.getArgument(0);
            n.setId(2L);
            return n;
        });

        NewsResponse created = newsService.createNews(req);

        assertNotNull(created);
        assertEquals("Monsoon Update", created.getTitle());
        verify(newsRepository).save(any(News.class));
    }
}
