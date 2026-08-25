package com.krishikendra.dto.response;

import java.time.LocalDate;

public class MarketPriceResponse {
    private Long id;
    private String commodity;
    private String market;
    private String district;
    private String state;
    private Double minimumPrice;
    private Double maximumPrice;
    private Double modalPrice;
    private LocalDate priceDate;
    private String source;

    public MarketPriceResponse() {
    }

    public MarketPriceResponse(Long id, String commodity, String market, String district, String state, Double minimumPrice, Double maximumPrice, Double modalPrice, LocalDate priceDate, String source) {
        this.id = id;
        this.commodity = commodity;
        this.market = market;
        this.district = district;
        this.state = state;
        this.minimumPrice = minimumPrice;
        this.maximumPrice = maximumPrice;
        this.modalPrice = modalPrice;
        this.priceDate = priceDate;
        this.source = source;
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
}
