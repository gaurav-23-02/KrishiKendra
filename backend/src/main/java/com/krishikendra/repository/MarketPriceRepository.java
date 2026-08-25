package com.krishikendra.repository;

import com.krishikendra.entity.MarketPrice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MarketPriceRepository extends JpaRepository<MarketPrice, Long> {

    @Query("SELECT mp FROM MarketPrice mp WHERE " +
           "(:state IS NULL OR LOWER(mp.state) = LOWER(:state)) AND " +
           "(:district IS NULL OR LOWER(mp.district) = LOWER(:district)) AND " +
           "(:market IS NULL OR LOWER(mp.market) = LOWER(:market)) AND " +
           "(:commodity IS NULL OR LOWER(mp.commodity) LIKE LOWER(CONCAT('%', :commodity, '%'))) AND " +
           "(:priceDate IS NULL OR mp.priceDate = :priceDate) " +
           "ORDER BY mp.priceDate DESC, mp.commodity ASC")
    Page<MarketPrice> searchMarketPrices(
            @Param("state") String state,
            @Param("district") String district,
            @Param("market") String market,
            @Param("commodity") String commodity,
            @Param("priceDate") LocalDate priceDate,
            Pageable pageable);

    @Query("SELECT mp FROM MarketPrice mp WHERE " +
           "LOWER(mp.commodity) = LOWER(:commodity) AND " +
           "(:market IS NULL OR LOWER(mp.market) = LOWER(:market)) AND " +
           "(:startDate IS NULL OR mp.priceDate >= :startDate) AND " +
           "(:endDate IS NULL OR mp.priceDate <= :endDate) " +
           "ORDER BY mp.priceDate ASC")
    List<MarketPrice> findPriceTrends(
            @Param("commodity") String commodity,
            @Param("market") String market,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT DISTINCT mp.state FROM MarketPrice mp ORDER BY mp.state ASC")
    List<String> findDistinctStates();

    @Query("SELECT DISTINCT mp.district FROM MarketPrice mp WHERE LOWER(mp.state) = LOWER(:state) ORDER BY mp.district ASC")
    List<String> findDistinctDistrictsByState(@Param("state") String state);

    @Query("SELECT DISTINCT mp.market FROM MarketPrice mp WHERE " +
           "(:state IS NULL OR LOWER(mp.state) = LOWER(:state)) AND " +
           "(:district IS NULL OR LOWER(mp.district) = LOWER(:district)) " +
           "ORDER BY mp.market ASC")
    List<String> findDistinctMarkets(
            @Param("state") String state,
            @Param("district") String district);

    @Query("SELECT DISTINCT mp.commodity FROM MarketPrice mp ORDER BY mp.commodity ASC")
    List<String> findDistinctCommodities();

    @Query("SELECT mp FROM MarketPrice mp WHERE LOWER(mp.commodity) = LOWER(:commodity) AND LOWER(mp.market) = LOWER(:market) ORDER BY mp.priceDate DESC")
    List<MarketPrice> findLatestByCommodityAndMarket(
            @Param("commodity") String commodity,
            @Param("market") String market,
            Pageable pageable);

    @Query("SELECT mp FROM MarketPrice mp WHERE LOWER(mp.state) = LOWER(:state) ORDER BY mp.priceDate DESC")
    List<MarketPrice> findTopRecentByState(@Param("state") String state, Pageable pageable);

    boolean existsByCommodityAndMarketAndPriceDate(String commodity, String market, LocalDate priceDate);
}
