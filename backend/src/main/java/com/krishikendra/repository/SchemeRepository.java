package com.krishikendra.repository;

import com.krishikendra.entity.Scheme;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SchemeRepository extends JpaRepository<Scheme, Long> {

    @Query("SELECT s FROM Scheme s WHERE " +
           "(:type IS NULL OR (:type = 'CENTRAL' AND LOWER(s.state) = 'central') OR (:type = 'STATE' AND LOWER(s.state) != 'central')) AND " +
           "(:state IS NULL OR LOWER(s.state) = LOWER(:state) OR LOWER(s.state) = 'central') AND " +
           "(:category IS NULL OR LOWER(s.category) = LOWER(:category)) AND " +
           "(:query IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.benefits) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY s.lastUpdated DESC, s.name ASC")
    Page<Scheme> filterSchemes(
            @Param("type") String type,
            @Param("state") String state,
            @Param("category") String category,
            @Param("query") String query,
            Pageable pageable);

    @Query("SELECT DISTINCT s.category FROM Scheme s ORDER BY s.category ASC")
    List<String> findDistinctCategories();

    @Query("SELECT DISTINCT s.state FROM Scheme s WHERE LOWER(s.state) != 'central' ORDER BY s.state ASC")
    List<String> findDistinctStates();

    List<Scheme> findTop5ByOrderByLastUpdatedDesc();
}
