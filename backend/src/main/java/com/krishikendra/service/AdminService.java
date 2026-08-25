package com.krishikendra.service;

import com.krishikendra.dto.response.AdminStatsResponse;
import com.krishikendra.dto.response.PagedResponse;
import com.krishikendra.dto.response.UserResponse;
import com.krishikendra.entity.Role;
import com.krishikendra.entity.User;
import com.krishikendra.exception.BadRequestException;
import com.krishikendra.exception.ResourceNotFoundException;
import com.krishikendra.repository.MarketPriceRepository;
import com.krishikendra.repository.NewsRepository;
import com.krishikendra.repository.SchemeRepository;
import com.krishikendra.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final MarketPriceRepository marketPriceRepository;
    private final SchemeRepository schemeRepository;
    private final NewsRepository newsRepository;
    private final AuthService authService;

    public AdminService(UserRepository userRepository,
                        MarketPriceRepository marketPriceRepository,
                        SchemeRepository schemeRepository,
                        NewsRepository newsRepository,
                        AuthService authService) {
        this.userRepository = userRepository;
        this.marketPriceRepository = marketPriceRepository;
        this.schemeRepository = schemeRepository;
        this.newsRepository = newsRepository;
        this.authService = authService;
    }

    public AdminStatsResponse getPlatformStats() {
        long totalUsers = userRepository.count();
        long totalFarmers = userRepository.countByRole(Role.FARMER);
        long totalAdmins = userRepository.countByRole(Role.ADMIN);
        long totalPrices = marketPriceRepository.count();
        long totalSchemes = schemeRepository.count();
        long totalNews = newsRepository.count();
        long totalCommodities = marketPriceRepository.findDistinctCommodities().size();
        long totalMarkets = marketPriceRepository.findDistinctMarkets(null, null).size();
        long totalStates = marketPriceRepository.findDistinctStates().size();

        return new AdminStatsResponse(
                totalUsers,
                totalFarmers,
                totalAdmins,
                totalPrices,
                totalSchemes,
                totalNews,
                totalCommodities,
                totalMarkets,
                totalStates
        );
    }

    public PagedResponse<UserResponse> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> usersPage = userRepository.findAll(pageable);

        List<UserResponse> list = usersPage.getContent().stream()
                .map(authService::mapToUserResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                list,
                usersPage.getNumber(),
                usersPage.getSize(),
                usersPage.getTotalElements(),
                usersPage.getTotalPages(),
                usersPage.isLast()
        );
    }

    @Transactional
    public UserResponse updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        try {
            Role newRole = Role.valueOf(roleName.toUpperCase().trim());
            user.setRole(newRole);
            User saved = userRepository.save(user);
            return authService.mapToUserResponse(saved);
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid role specified. Valid roles are FARMER, ADMIN.");
        }
    }

    @Transactional
    public void deleteUser(Long userId) {
        User currentUser = authService.getCurrentUserEntity();
        if (currentUser.getId().equals(userId)) {
            throw new BadRequestException("You cannot delete your own admin account.");
        }
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }
}
