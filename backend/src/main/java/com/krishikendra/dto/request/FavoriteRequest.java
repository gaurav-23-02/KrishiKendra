package com.krishikendra.dto.request;

import jakarta.validation.constraints.NotBlank;

public class FavoriteRequest {

    @NotBlank(message = "Commodity is required")
    private String commodity;

    @NotBlank(message = "Market is required")
    private String market;

    public FavoriteRequest() {
    }

    public FavoriteRequest(String commodity, String market) {
        this.commodity = commodity;
        this.market = market;
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
}
