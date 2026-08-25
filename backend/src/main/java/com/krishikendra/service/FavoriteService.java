package com.krishikendra.service;

import com.krishikendra.dto.request.FavoriteRequest;
import com.krishikendra.dto.response.FavoriteResponse;
import com.krishikendra.entity.Favorite;
import com.krishikendra.entity.MarketPrice;
import com.krishikendra.entity.User;
import com.krishikendra.exception.BadRequestException;
import com.krishikendra.exception.ResourceNotFoundException;
import com.krishikendra.repository.FavoriteRepository;
import com.krishikendra.repository.MarketPriceRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final MarketPriceRepository marketPriceRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, MarketPriceRepository marketPriceRepository) {
        this.favoriteRepository = favoriteRepository;
        this.marketPriceRepository = marketPriceRepository;
    }

    public List<FavoriteResponse> getUserFavorites(User user) {
        List<Favorite> favorites = favoriteRepository.findByUserOrderByCreatedAtDesc(user);
        List<FavoriteResponse> responses = new ArrayList<>();

        for (Favorite fav : favorites) {
            Double latestPrice = null;
            Double changePercent = null;

            List<MarketPrice> latestRecords = marketPriceRepository.findLatestByCommodityAndMarket(
                    fav.getCommodity(),
                    fav.getMarket(),
                    PageRequest.of(0, 2)
            );

            if (!latestRecords.isEmpty()) {
                latestPrice = latestRecords.get(0).getModalPrice();
                if (latestRecords.size() > 1) {
                    double prev = latestRecords.get(1).getModalPrice();
                    if (prev > 0) {
                        changePercent = Math.round(((latestPrice - prev) / prev * 100.0) * 100.0) / 100.0;
                    }
                }
            }

            responses.add(new FavoriteResponse(
                    fav.getId(),
                    fav.getCommodity(),
                    fav.getMarket(),
                    latestPrice,
                    changePercent,
                    fav.getCreatedAt()
            ));
        }

        return responses;
    }

    @Transactional
    public FavoriteResponse addFavorite(User user, FavoriteRequest request) {
        String commodity = request.getCommodity().trim();
        String market = request.getMarket().trim();

        if (favoriteRepository.existsByUserAndCommodityAndMarket(user, commodity, market)) {
            throw new BadRequestException("This crop and market pair is already in your favorites.");
        }

        Favorite fav = new Favorite(user, commodity, market);
        Favorite saved = favoriteRepository.save(fav);

        List<MarketPrice> latestRecords = marketPriceRepository.findLatestByCommodityAndMarket(
                commodity,
                market,
                PageRequest.of(0, 1)
        );
        Double latestPrice = latestRecords.isEmpty() ? null : latestRecords.get(0).getModalPrice();

        return new FavoriteResponse(
                saved.getId(),
                saved.getCommodity(),
                saved.getMarket(),
                latestPrice,
                0.0,
                saved.getCreatedAt()
        );
    }

    @Transactional
    public void removeFavorite(User user, Long favoriteId) {
        Favorite fav = favoriteRepository.findByUserAndId(user, favoriteId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found with id: " + favoriteId));
        favoriteRepository.delete(fav);
    }

    public boolean isFavorite(User user, String commodity, String market) {
        if (commodity == null || market == null) return false;
        return favoriteRepository.existsByUserAndCommodityAndMarket(user, commodity.trim(), market.trim());
    }
}
