package com.krishikendra.service;

import com.krishikendra.dto.request.SchemeRequest;
import com.krishikendra.dto.response.PagedResponse;
import com.krishikendra.dto.response.SchemeResponse;
import com.krishikendra.entity.Scheme;
import com.krishikendra.repository.SchemeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SchemeServiceTest {

    @Mock
    private SchemeRepository schemeRepository;

    @InjectMocks
    private SchemeService schemeService;

    private Scheme sampleScheme;

    @BeforeEach
    void setUp() {
        sampleScheme = new Scheme(
                "PM-KISAN",
                "Income support scheme",
                "All landholding farmers",
                "₹6,000 per year",
                "Online portal",
                "Financial Assistance",
                "Central",
                "https://pmkisan.gov.in",
                LocalDate.now()
        );
        sampleScheme.setId(1L);
    }

    @Test
    void filterSchemes_ReturnsPagedResponse() {
        Page<Scheme> page = new PageImpl<>(List.of(sampleScheme));
        when(schemeRepository.filterSchemes(isNull(), isNull(), isNull(), isNull(), any(Pageable.class)))
                .thenReturn(page);

        PagedResponse<SchemeResponse> response = schemeService.filterSchemes(null, null, null, null, 0, 10);

        assertNotNull(response);
        assertEquals(1, response.getContent().size());
        assertEquals("PM-KISAN", response.getContent().get(0).getName());
    }

    @Test
    void getSchemeById_Success() {
        when(schemeRepository.findById(1L)).thenReturn(Optional.of(sampleScheme));

        SchemeResponse response = schemeService.getSchemeById(1L);

        assertNotNull(response);
        assertEquals("PM-KISAN", response.getName());
    }

    @Test
    void createScheme_SavesAndReturns() {
        SchemeRequest req = new SchemeRequest();
        req.setName("Soil Health Card");
        req.setDescription("Nutrient assessment");
        req.setEligibility("All farmers");
        req.setBenefits("Free testing");
        req.setApplicationProcess("CSC");
        req.setCategory("Farmer Welfare");
        req.setState("Central");

        when(schemeRepository.save(any(Scheme.class))).thenAnswer(invocation -> {
            Scheme s = invocation.getArgument(0);
            s.setId(2L);
            return s;
        });

        SchemeResponse created = schemeService.createScheme(req);

        assertNotNull(created);
        assertEquals("Soil Health Card", created.getName());
        verify(schemeRepository).save(any(Scheme.class));
    }
}
