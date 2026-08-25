package com.krishikendra.repository;

import com.krishikendra.entity.News;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsRepository extends JpaRepository<News, Long> {

    @Query("SELECT n FROM News n WHERE " +
           "(:category IS NULL OR LOWER(n.category) = LOWER(:category)) AND " +
           "(:query IS NULL OR LOWER(n.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(n.summary) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "ORDER BY n.publishedAt DESC")
    Page<News> filterNews(
            @Param("category") String category,
            @Param("query") String query,
            Pageable pageable);

    @Query("SELECT DISTINCT n.category FROM News n ORDER BY n.category ASC")
    List<String> findDistinctCategories();

    List<News> findTop5ByOrderByPublishedAtDesc();
}
