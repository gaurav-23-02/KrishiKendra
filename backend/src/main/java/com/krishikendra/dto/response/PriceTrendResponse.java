package com.krishikendra.dto.response;

import java.time.LocalDate;
import java.util.List;

public class PriceTrendResponse {
    private String commodity;
    private String market;
    private Double currentPrice;
    private Double highestPrice;
    private Double lowestPrice;
    private Double averagePrice;
    private Double percentageChange;
    private List<TrendPoint> dataPoints;

    public static class TrendPoint {
        private LocalDate date;
        private Double modalPrice;
        private Double minPrice;
        private Double maxPrice;

        public TrendPoint() {
        }

        public TrendPoint(LocalDate date, Double modalPrice, Double minPrice, Double maxPrice) {
            this.date = date;
            this.modalPrice = modalPrice;
            this.minPrice = minPrice;
            this.maxPrice = maxPrice;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public Double getModalPrice() {
            return modalPrice;
        }

        public void setModalPrice(Double modalPrice) {
            this.modalPrice = modalPrice;
        }

        public Double getMinPrice() {
            return minPrice;
        }

        public void setMinPrice(Double minPrice) {
            this.minPrice = minPrice;
        }

        public Double getMaxPrice() {
            return maxPrice;
        }

        public void setMaxPrice(Double maxPrice) {
            this.maxPrice = maxPrice;
        }
    }

    public PriceTrendResponse() {
    }

    public PriceTrendResponse(String commodity, String market, Double currentPrice, Double highestPrice, Double lowestPrice, Double averagePrice, Double percentageChange, List<TrendPoint> dataPoints) {
        this.commodity = commodity;
        this.market = market;
        this.currentPrice = currentPrice;
        this.highestPrice = highestPrice;
        this.lowestPrice = lowestPrice;
        this.averagePrice = averagePrice;
        this.percentageChange = percentageChange;
        this.dataPoints = dataPoints;
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

    public Double getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(Double currentPrice) {
        this.currentPrice = currentPrice;
    }

    public Double getHighestPrice() {
        return highestPrice;
    }

    public void setHighestPrice(Double highestPrice) {
        this.highestPrice = highestPrice;
    }

    public Double getLowestPrice() {
        return lowestPrice;
    }

    public void setLowestPrice(Double lowestPrice) {
        this.lowestPrice = lowestPrice;
    }

    public Double getAveragePrice() {
        return averagePrice;
    }

    public void setAveragePrice(Double averagePrice) {
        this.averagePrice = averagePrice;
    }

    public Double getPercentageChange() {
        return percentageChange;
    }

    public void setPercentageChange(Double percentageChange) {
        this.percentageChange = percentageChange;
    }

    public List<TrendPoint> getDataPoints() {
        return dataPoints;
    }

    public void setDataPoints(List<TrendPoint> dataPoints) {
        this.dataPoints = dataPoints;
    }
}
