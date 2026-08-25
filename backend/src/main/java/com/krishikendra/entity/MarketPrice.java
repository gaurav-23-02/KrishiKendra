package com.krishikendra.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "market_prices", indexes = {
    @Index(name = "idx_mp_state_dist_comm", columnList = "state, district, commodity"),
    @Index(name = "idx_mp_comm_market_date", columnList = "commodity, market, price_date"),
    @Index(name = "idx_mp_price_date", columnList = "price_date")
})
public class MarketPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String commodity;

    @Column(nullable = false)
    private String market;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String state;

    @Column(name = "minimum_price", nullable = false)
    private Double minimumPrice;

    @Column(name = "maximum_price", nullable = false)
    private Double maximumPrice;

    @Column(name = "modal_price", nullable = false)
    private Double modalPrice;

    @Column(name = "price_date", nullable = false)
    private LocalDate priceDate;

    @Column(nullable = false)
    private String source = "Agmarknet / data.gov.in";

    @Column(name = "fetched_at", nullable = false)
    private LocalDateTime fetchedAt;

    @PrePersist
    protected void onCreate() {
        if (fetchedAt == null) {
            fetchedAt = LocalDateTime.now();
        }
    }

    public MarketPrice() {
    }

    public MarketPrice(String commodity, String market, String district, String state, Double minimumPrice, Double maximumPrice, Double modalPrice, LocalDate priceDate, String source) {
        this.commodity = commodity;
        this.market = market;
        this.district = district;
        this.state = state;
        this.minimumPrice = minimumPrice;
        this.maximumPrice = maximumPrice;
        this.modalPrice = modalPrice;
        this.priceDate = priceDate;
        this.source = source != null ? source : "Agmarknet / data.gov.in";
        this.fetchedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCommodity() {
        return commodity;
    }

    public void setCommodity(String commodity) {
        this.commodity = commodity;
    }

    public String getMarket() {
        return market;
    }

    public void setMarket(String market) {
        this.market = market;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Double getMinimumPrice() {
        return minimumPrice;
    }

    public void setMinimumPrice(Double minimumPrice) {
        this.minimumPrice = minimumPrice;
    }

    public Double getMaximumPrice() {
        return maximumPrice;
    }

    public void setMaximumPrice(Double maximumPrice) {
        this.maximumPrice = maximumPrice;
    }

    public Double getModalPrice() {
        return modalPrice;
    }

    public void setModalPrice(Double modalPrice) {
        this.modalPrice = modalPrice;
    }

    public LocalDate getPriceDate() {
        return priceDate;
    }

    public void setPriceDate(LocalDate priceDate) {
        this.priceDate = priceDate;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public LocalDateTime getFetchedAt() {
        return fetchedAt;
    }

    public void setFetchedAt(LocalDateTime fetchedAt) {
        this.fetchedAt = fetchedAt;
    }
}
