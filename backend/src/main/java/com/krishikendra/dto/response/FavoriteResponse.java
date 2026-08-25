package com.krishikendra.dto.response;

import java.time.LocalDateTime;

public class FavoriteResponse {
    private Long id;
    private String commodity;
    private String market;
    private Double latestModalPrice;
    private Double priceChangePercent;
    private LocalDateTime createdAt;

    public FavoriteResponse() {
    }

    public FavoriteResponse(Long id, String commodity, String market, Double latestModalPrice, Double priceChangePercent, LocalDateTime createdAt) {
        this.id = id;
        this.commodity = commodity;
        this.market = market;
        this.latestModalPrice = latestModalPrice;
        this.priceChangePercent = priceChangePercent;
        this.createdAt = createdAt;
    }

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

    public Double getLatestModalPrice() {
        return latestModalPrice;
    }

    public void setLatestModalPrice(Double latestModalPrice) {
        this.latestModalPrice = latestModalPrice;
    }

    public Double getPriceChangePercent() {
        return priceChangePercent;
    }

    public void setPriceChangePercent(Double priceChangePercent) {
        this.priceChangePercent = priceChangePercent;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
