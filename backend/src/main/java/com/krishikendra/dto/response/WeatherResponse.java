package com.krishikendra.dto.response;

import java.util.List;

public class WeatherResponse {
    private String location;
    private String country;
    private Double temperature;
    private Double feelsLike;
    private Double tempMin;
    private Double tempMax;
    private Integer humidity;
    private Double windSpeed;
    private String condition;
    private String description;
    private String icon;
    private Integer pressure;
    private String sunrise;
    private String sunset;
    private List<String> advisories;
    private List<ForecastItem> forecast;

    public static class ForecastItem {
        private String date;
        private Double temp;
        private Double tempMin;
        private Double tempMax;
        private Integer humidity;
        private String condition;
        private String description;
        private String icon;
        private Double rainProbability;

        public ForecastItem() {
        }

        public ForecastItem(String date, Double temp, Double tempMin, Double tempMax, Integer humidity, String condition, String description, String icon, Double rainProbability) {
            this.date = date;
            this.temp = temp;
            this.tempMin = tempMin;
            this.tempMax = tempMax;
            this.humidity = humidity;
            this.condition = condition;
            this.description = description;
            this.icon = icon;
            this.rainProbability = rainProbability;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public Double getTemp() {
            return temp;
        }

        public void setTemp(Double temp) {
            this.temp = temp;
        }

        public Double getTempMin() {
            return tempMin;
        }

        public void setTempMin(Double tempMin) {
            this.tempMin = tempMin;
        }

        public Double getTempMax() {
            return tempMax;
        }

        public void setTempMax(Double tempMax) {
            this.tempMax = tempMax;
        }

        public Integer getHumidity() {
            return humidity;
        }

        public void setHumidity(Integer humidity) {
            this.humidity = humidity;
        }

        public String getCondition() {
            return condition;
        }

        public void setCondition(String condition) {
            this.condition = condition;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getIcon() {
            return icon;
        }

        public void setIcon(String icon) {
            this.icon = icon;
        }

        public Double getRainProbability() {
            return rainProbability;
        }

        public void setRainProbability(Double rainProbability) {
            this.rainProbability = rainProbability;
        }
    }

    public WeatherResponse() {
    }

    // Getters and Setters
    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getFeelsLike() {
        return feelsLike;
    }

    public void setFeelsLike(Double feelsLike) {
        this.feelsLike = feelsLike;
    }

    public Double getTempMin() {
        return tempMin;
    }

    public void setTempMin(Double tempMin) {
        this.tempMin = tempMin;
    }

    public Double getTempMax() {
        return tempMax;
    }

    public void setTempMax(Double tempMax) {
        this.tempMax = tempMax;
    }

    public Integer getHumidity() {
        return humidity;
    }

    public void setHumidity(Integer humidity) {
        this.humidity = humidity;
    }

    public Double getWindSpeed() {
        return windSpeed;
    }

    public void setWindSpeed(Double windSpeed) {
        this.windSpeed = windSpeed;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public Integer getPressure() {
        return pressure;
    }

    public void setPressure(Integer pressure) {
        this.pressure = pressure;
    }

    public String getSunrise() {
        return sunrise;
    }

    public void setSunrise(String sunrise) {
        this.sunrise = sunrise;
    }

    public String getSunset() {
        return sunset;
    }

    public void setSunset(String sunset) {
        this.sunset = sunset;
    }

    public List<String> getAdvisories() {
        return advisories;
    }

    public void setAdvisories(List<String> advisories) {
        this.advisories = advisories;
    }

    public List<ForecastItem> getForecast() {
        return forecast;
    }

    public void setForecast(List<ForecastItem> forecast) {
        this.forecast = forecast;
    }
}
