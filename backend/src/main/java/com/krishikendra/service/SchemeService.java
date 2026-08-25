package com.krishikendra.service;

import com.krishikendra.dto.request.SchemeRequest;
import com.krishikendra.dto.response.PagedResponse;
import com.krishikendra.dto.response.SchemeResponse;
import com.krishikendra.entity.Scheme;
import com.krishikendra.exception.ResourceNotFoundException;
import com.krishikendra.repository.SchemeRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SchemeService {

    private final SchemeRepository schemeRepository;

    public SchemeService(SchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }

    public PagedResponse<SchemeResponse> filterSchemes(String type, String state, String category, String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Scheme> results = schemeRepository.filterSchemes(
                cleanParam(type),
                cleanParam(state),
                cleanParam(category),
                cleanParam(query),
                pageable);

        List<SchemeResponse> list = results.getContent().stream()
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

    public SchemeResponse getSchemeById(Long id) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Government scheme not found with id: " + id));
        return mapToResponse(scheme);
    }

    public List<SchemeResponse> getRecentSchemes(int limit) {
        return schemeRepository.findTop5ByOrderByLastUpdatedDesc().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Cacheable("schemeCategories")
    public List<String> getDistinctCategories() {
        return schemeRepository.findDistinctCategories();
    }

    @Cacheable("schemeStates")
    public List<String> getDistinctStates() {
        return schemeRepository.findDistinctStates();
    }

    @Transactional
    @CacheEvict(value = {"schemeCategories", "schemeStates"}, allEntries = true)
    public SchemeResponse createScheme(SchemeRequest request) {
        Scheme scheme = new Scheme(
                request.getName().trim(),
                request.getDescription().trim(),
                request.getEligibility().trim(),
                request.getBenefits().trim(),
                request.getApplicationProcess().trim(),
                request.getCategory().trim(),
                request.getState() != null ? request.getState().trim() : "Central",
                request.getOfficialUrl() != null ? request.getOfficialUrl().trim() : null,
                LocalDate.now()
        );
        Scheme saved = schemeRepository.save(scheme);
        return mapToResponse(saved);
    }

    @Transactional
    @CacheEvict(value = {"schemeCategories", "schemeStates"}, allEntries = true)
    public SchemeResponse updateScheme(Long id, SchemeRequest request) {
        Scheme scheme = schemeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Government scheme not found with id: " + id));

        scheme.setName(request.getName().trim());
        scheme.setDescription(request.getDescription().trim());
        scheme.setEligibility(request.getEligibility().trim());
        scheme.setBenefits(request.getBenefits().trim());
        scheme.setApplicationProcess(request.getApplicationProcess().trim());
        scheme.setCategory(request.getCategory().trim());
        scheme.setState(request.getState() != null ? request.getState().trim() : "Central");
        scheme.setOfficialUrl(request.getOfficialUrl() != null ? request.getOfficialUrl().trim() : null);
        scheme.setLastUpdated(LocalDate.now());

        Scheme updated = schemeRepository.save(scheme);
        return mapToResponse(updated);
    }

    @Transactional
    @CacheEvict(value = {"schemeCategories", "schemeStates"}, allEntries = true)
    public void deleteScheme(Long id) {
        if (!schemeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Government scheme not found with id: " + id);
        }
        schemeRepository.deleteById(id);
    }

    public SchemeResponse mapToResponse(Scheme s) {
        return new SchemeResponse(
                s.getId(),
                s.getName(),
                s.getDescription(),
                s.getEligibility(),
                s.getBenefits(),
                s.getApplicationProcess(),
                s.getCategory(),
                s.getState(),
                s.getOfficialUrl(),
                s.getLastUpdated()
        );
    }

    private String cleanParam(String val) {
        return (val != null && !val.isBlank() && !val.equalsIgnoreCase("all")) ? val.trim() : null;
    }
}
