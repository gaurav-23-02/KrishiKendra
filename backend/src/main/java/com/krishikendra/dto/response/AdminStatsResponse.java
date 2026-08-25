package com.krishikendra.dto.response;

public class AdminStatsResponse {
    private long totalUsers;
    private long totalFarmers;
    private long totalAdmins;
    private long totalMarketPriceRecords;
    private long totalSchemes;
    private long totalNewsArticles;
    private long totalCommodities;
    private long totalMarkets;
    private long totalStates;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(long totalUsers, long totalFarmers, long totalAdmins, long totalMarketPriceRecords, long totalSchemes, long totalNewsArticles, long totalCommodities, long totalMarkets, long totalStates) {
        this.totalUsers = totalUsers;
        this.totalFarmers = totalFarmers;
        this.totalAdmins = totalAdmins;
        this.totalMarketPriceRecords = totalMarketPriceRecords;
        this.totalSchemes = totalSchemes;
        this.totalNewsArticles = totalNewsArticles;
        this.totalCommodities = totalCommodities;
        this.totalMarkets = totalMarkets;
        this.totalStates = totalStates;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalFarmers() {
        return totalFarmers;
    }

    public void setTotalFarmers(long totalFarmers) {
        this.totalFarmers = totalFarmers;
    }

    public long getTotalAdmins() {
        return totalAdmins;
    }

    public void setTotalAdmins(long totalAdmins) {
        this.totalAdmins = totalAdmins;
    }

    public long getTotalMarketPriceRecords() {
        return totalMarketPriceRecords;
    }

    public void setTotalMarketPriceRecords(long totalMarketPriceRecords) {
        this.totalMarketPriceRecords = totalMarketPriceRecords;
    }

    public long getTotalSchemes() {
        return totalSchemes;
    }

    public void setTotalSchemes(long totalSchemes) {
        this.totalSchemes = totalSchemes;
    }

    public long getTotalNewsArticles() {
        return totalNewsArticles;
    }

    public void setTotalNewsArticles(long totalNewsArticles) {
        this.totalNewsArticles = totalNewsArticles;
    }

    public long getTotalCommodities() {
        return totalCommodities;
    }

    public void setTotalCommodities(long totalCommodities) {
        this.totalCommodities = totalCommodities;
    }

    public long getTotalMarkets() {
        return totalMarkets;
    }

    public void setTotalMarkets(long totalMarkets) {
        this.totalMarkets = totalMarkets;
    }

    public long getTotalStates() {
        return totalStates;
    }

    public void setTotalStates(long totalStates) {
        this.totalStates = totalStates;
    }
}
