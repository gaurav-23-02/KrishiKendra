package com.krishikendra.repository;

import com.krishikendra.entity.Favorite;
import com.krishikendra.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserOrderByCreatedAtDesc(User user);
    Optional<Favorite> findByUserAndId(User user, Long id);
    Optional<Favorite> findByUserAndCommodityAndMarket(User user, String commodity, String market);
    boolean existsByUserAndCommodityAndMarket(User user, String commodity, String market);
    void deleteByUserAndId(User user, Long id);
}
