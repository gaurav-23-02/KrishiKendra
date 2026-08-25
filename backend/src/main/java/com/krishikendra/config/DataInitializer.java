package com.krishikendra.config;

import com.krishikendra.entity.*;
import com.krishikendra.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final MarketPriceRepository marketPriceRepository;
    private final SchemeRepository schemeRepository;
    private final NewsRepository newsRepository;
    private final FavoriteRepository favoriteRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           MarketPriceRepository marketPriceRepository,
                           SchemeRepository schemeRepository,
                           NewsRepository newsRepository,
                           FavoriteRepository favoriteRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.marketPriceRepository = marketPriceRepository;
        this.schemeRepository = schemeRepository;
        this.newsRepository = newsRepository;
        this.favoriteRepository = favoriteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUsers();
        seedMarketPrices();
        seedSchemes();
        seedNews();
        seedFavorites();
        log.info("Krishi Kendra agricultural platform data initialization completed successfully.");
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            // 1. Admin User
            User admin = new User(
                    "Krishi Admin",
                    "admin@krishikendra.gov.in",
                    passwordEncoder.encode("Admin@123"),
                    "9876543210",
                    "Delhi",
                    "New Delhi",
                    "en",
                    Role.ADMIN
            );
            userRepository.save(admin);

            // 2. Demo Farmer User
            User farmer = new User(
                    "Ramesh Patel",
                    "farmer@krishikendra.gov.in",
                    passwordEncoder.encode("Farmer@123"),
                    "9823456789",
                    "Madhya Pradesh",
                    "Bhopal",
                    "en",
                    Role.FARMER
            );
            userRepository.save(farmer);

            log.info("Default Admin and Farmer accounts created.");
        }
    }

    private void seedMarketPrices() {
        if (marketPriceRepository.count() == 0) {
            LocalDate today = LocalDate.now();

            // Seed historical data across 30 days for trend visualizer
            String[][] cropsAndMandis = {
                    {"Wheat", "Bhopal", "Bhopal", "Madhya Pradesh", "2150", "2450", "2300"},
                    {"Wheat", "Indore", "Indore", "Madhya Pradesh", "2200", "2520", "2360"},
                    {"Wheat", "Ujjain", "Ujjain", "Madhya Pradesh", "2100", "2400", "2280"},
                    {"Wheat", "Jaipur", "Jaipur", "Rajasthan", "2250", "2550", "2400"},
                    {"Wheat", "Kota", "Kota", "Rajasthan", "2180", "2460", "2320"},
                    {"Wheat", "Ludhiana", "Ludhiana", "Punjab", "2275", "2575", "2425"},
                    {"Wheat", "Karnal", "Karnal", "Haryana", "2260", "2540", "2390"},
                    {"Wheat", "Lucknow", "Lucknow", "Uttar Pradesh", "2180", "2430", "2310"},
                    {"Soybean", "Bhopal", "Bhopal", "Madhya Pradesh", "4300", "4850", "4620"},
                    {"Soybean", "Indore", "Indore", "Madhya Pradesh", "4400", "4950", "4710"},
                    {"Soybean", "Nagpur", "Nagpur", "Maharashtra", "4350", "4880", "4650"},
                    {"Mustard", "Jaipur", "Jaipur", "Rajasthan", "5300", "5950", "5650"},
                    {"Mustard", "Kota", "Kota", "Rajasthan", "5250", "5880", "5580"},
                    {"Mustard", "Bhopal", "Bhopal", "Madhya Pradesh", "5150", "5750", "5480"},
                    {"Mustard", "Agra", "Agra", "Uttar Pradesh", "5200", "5800", "5520"},
                    {"Paddy", "Karnal", "Karnal", "Haryana", "2300", "3600", "3100"},
                    {"Paddy", "Ludhiana", "Ludhiana", "Punjab", "2250", "3550", "3050"},
                    {"Paddy", "Varanasi", "Varanasi", "Uttar Pradesh", "2183", "2800", "2450"},
                    {"Paddy", "Patna", "Patna", "Bihar", "2183", "2650", "2380"},
                    {"Cotton", "Rajkot", "Rajkot", "Gujarat", "6800", "7650", "7250"},
                    {"Cotton", "Nagpur", "Nagpur", "Maharashtra", "6700", "7550", "7180"},
                    {"Gram", "Bhopal", "Bhopal", "Madhya Pradesh", "5600", "6350", "6020"},
                    {"Gram", "Indore", "Indore", "Madhya Pradesh", "5650", "6400", "6080"},
                    {"Gram", "Jaipur", "Jaipur", "Rajasthan", "5550", "6300", "5980"},
                    {"Maize", "Chhindwara", "Chhindwara", "Madhya Pradesh", "1950", "2350", "2180"},
                    {"Maize", "Davangere", "Davangere", "Karnataka", "2000", "2400", "2220"},
                    {"Onion", "Nashik", "Nashik", "Maharashtra", "1800", "3200", "2600"},
                    {"Onion", "Pune", "Pune", "Maharashtra", "1900", "3300", "2700"},
                    {"Onion", "Indore", "Indore", "Madhya Pradesh", "1750", "3050", "2500"},
                    {"Potato", "Agra", "Agra", "Uttar Pradesh", "1100", "1650", "1400"},
                    {"Potato", "Jalandhar", "Jalandhar", "Punjab", "1050", "1580", "1350"},
                    {"Tomato", "Kolar", "Kolar", "Karnataka", "1400", "2600", "2100"},
                    {"Tomato", "Nashik", "Nashik", "Maharashtra", "1350", "2500", "2000"},
                    {"Garlic", "Mandsaur", "Mandsaur", "Madhya Pradesh", "9500", "16500", "13200"},
                    {"Turmeric", "Nizamabad", "Nizamabad", "Telangana", "12500", "16800", "14900"}
            };

            int[] pastDays = {0, 1, 2, 3, 5, 7, 10, 14, 18, 22, 26, 30};

            for (String[] row : cropsAndMandis) {
                String crop = row[0];
                String market = row[1];
                String dist = row[2];
                String state = row[3];
                double baseMin = Double.parseDouble(row[4]);
                double baseMax = Double.parseDouble(row[5]);
                double baseModal = Double.parseDouble(row[6]);

                for (int dayOffset : pastDays) {
                    LocalDate date = today.minusDays(dayOffset);
                    // Add slight historical price variance (+/- 1-3%)
                    double factor = 1.0 - (dayOffset * 0.002) + ((dayOffset % 3 == 0) ? 0.015 : -0.01);
                    double modal = Math.round(baseModal * factor);
                    double min = Math.round(baseMin * factor);
                    double max = Math.round(baseMax * factor);

                    MarketPrice mp = new MarketPrice(
                            crop, market, dist, state, min, max, modal, date, "Agmarknet / data.gov.in"
                    );
                    marketPriceRepository.save(mp);
                }
            }
            log.info("Seeded authentic Mandi price records with 30-day historical time series.");
        }
    }

    private void seedSchemes() {
        if (schemeRepository.count() == 0) {
            List<Scheme> list = List.of(
                    new Scheme(
                            "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
                            "A Central Sector scheme with 100% funding from Government of India to provide income support of ₹6,000 per year to all landholding farmer families across the country.",
                            "All landholding farmer families who have cultivable land holding in their names are eligible. Excludes institutional landholders, government employees, and income tax payers.",
                            "Direct cash transfer of ₹6,000 per year in three equal installments of ₹2,000 every 4 months directly into Aadhaar-linked bank accounts.",
                            "Farmers can register online via the PM-KISAN web portal (pmkisan.gov.in) using Aadhaar, or through local CSC centres and State Nodal Officers.",
                            "Financial Assistance",
                            "Central",
                            "https://pmkisan.gov.in",
                            LocalDate.now().minusDays(10)
                    ),
                    new Scheme(
                            "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                            "Comprehensive crop insurance scheme providing financial support and risk cover to farmers suffering crop loss/damage due to natural calamities, pests, and unseasonal weather.",
                            "All farmers growing notified crops in notified areas including sharecroppers and tenant farmers are eligible for coverage.",
                            "Very low uniform premium: 2% for Kharif crops, 1.5% for Rabi food crops & oilseeds, and 5% for commercial/horticultural crops. Balance premium is subsidized by Government.",
                            "Apply through local banks, Primary Agricultural Credit Societies (PACS), CSCs, or directly on the National Crop Insurance Portal (pmfby.gov.in).",
                            "Crop Insurance",
                            "Central",
                            "https://pmfby.gov.in",
                            LocalDate.now().minusDays(5)
                    ),
                    new Scheme(
                            "Kisan Credit Card (KCC) Scheme",
                            "Provides adequate and timely credit support from the banking system for agricultural and allied activities, input purchases, and working capital.",
                            "All individual farmers, joint borrowers, tenant farmers, oral lessees, sharecroppers, and Self Help Groups (SHGs) are eligible.",
                            "Revolving credit facility up to ₹3 Lakh at an effective interest rate of 4% per annum (with prompt repayment incentive). No collateral needed up to ₹1.60 Lakh.",
                            "Submit a one-page application form at any public/private commercial bank, regional rural bank, or cooperative bank along with land records and KYC.",
                            "Loans & Credit",
                            "Central",
                            "https://myscheme.gov.in/schemes/kcc",
                            LocalDate.now().minusDays(15)
                    ),
                    new Scheme(
                            "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY - Per Drop More Crop)",
                            "Promotes micro-irrigation systems (drip and sprinkler) to maximize water use efficiency, reduce input costs, and enhance crop productivity.",
                            "Farmers having cultivable land with an assured water source are eligible. Priority given to small and marginal farmers, SC/ST, and women farmers.",
                            "Financial subsidy ranging from 45% to 55% of the micro-irrigation system cost depending on farmer landholding category.",
                            "Apply through the State Department of Agriculture / Horticulture online portal or district horticulture officer.",
                            "Irrigation",
                            "Central",
                            "https://pmksy.gov.in",
                            LocalDate.now().minusDays(20)
                    ),
                    new Scheme(
                            "Sub-Mission on Agricultural Mechanization (SMAM)",
                            "Promotes agricultural mechanization and farm power availability among small and marginal farmers through Custom Hiring Centres and equipment subsidies.",
                            "Individual farmers, registered farmer groups, FPOs, and cooperatives in all states.",
                            "40% to 50% capital subsidy on purchasing farm machinery like tractors, power tillers, rotavators, combine harvesters, and laser land levelers.",
                            "Register on the centralized SMAM portal (agrimachinery.nic.in) and upload KYC, land records, and quotation.",
                            "Equipment & Machinery",
                            "Central",
                            "https://agrimachinery.nic.in",
                            LocalDate.now().minusDays(12)
                    ),
                    new Scheme(
                            "Soil Health Card (SHC) Scheme",
                            "Assists state governments to issue soil health cards to all farmers, detailing nutrient status and customized fertilizer dosage recommendations.",
                            "All farmers across the country are eligible without any fee.",
                            "Provides customized 12-parameter soil fertility assessment (N, P, K, S, micronutrients, pH, EC) and optimal fertilizer/manure recommendations to cut cultivation costs by 15-20%.",
                            "Soil samples are collected by agriculture extension staff; cards can be downloaded online from soilhealth.dac.gov.in.",
                            "Farmer Welfare",
                            "Central",
                            "https://soilhealth.dac.gov.in",
                            LocalDate.now().minusDays(25)
                    ),
                    new Scheme(
                            "National Agriculture Market (e-NAM)",
                            "Pan-India electronic trading portal networking the existing APMC mandis to create a unified national market for agricultural commodities.",
                            "Any farmer with produce registered at a linked APMC mandi.",
                            "Transparent online bidding, real-time price discovery, nationwide buyer reach, and direct online payment into bank accounts without middleman deductions.",
                            "Register on enam.gov.in or at the gate of any e-NAM integrated APMC mandi with KYC and bank details.",
                            "Subsidies",
                            "Central",
                            "https://enam.gov.in",
                            LocalDate.now().minusDays(8)
                    ),
                    new Scheme(
                            "Paramparagat Krishi Vikas Yojana (PKVY)",
                            "Promotes organic farming through a cluster approach and Participatory Guarantee System (PGS) certification.",
                            "Farmers forming clusters of 20 or more farmers having 50 acres of contiguous land.",
                            "Financial assistance of ₹50,000 per hectare over 3 years, of which ₹31,000 is directly provided for organic inputs (seeds, bio-fertilizers, vermicompost).",
                            "Contact the District Agriculture Officer or local Krishi Vigyan Kendra to register under an active cluster.",
                            "Subsidies",
                            "Central",
                            "https://pgsindia-ncof.gov.in",
                            LocalDate.now().minusDays(18)
                    ),
                    new Scheme(
                            "Mukhyamantri Kisan Kalyan Yojana (MP)",
                            "State-level income support scheme launched by the Government of Madhya Pradesh to supplement central PM-KISAN benefits.",
                            "Registered beneficiaries of PM-KISAN residing in Madhya Pradesh with valid land records.",
                            "Additional annual financial benefit of ₹6,000 paid in three equal installments of ₹2,000, bringing total farmer support to ₹12,000/year.",
                            "Automatically integrated for verified PM-KISAN beneficiaries in MP via the SAARA portal (saara.mp.gov.in).",
                            "Financial Assistance",
                            "Madhya Pradesh",
                            "https://saara.mp.gov.in",
                            LocalDate.now().minusDays(7)
                    ),
                    new Scheme(
                            "PM Kisan Urja Suraksha evam Utthaan Mahabhiyan (PM-KUSUM)",
                            "Provides energy security and de-dieselization of agriculture by deploying standalone solar agriculture pumps and solarizing grid-connected pumps.",
                            "Individual farmers, water user associations, and farmer producer organizations.",
                            "Up to 60% total subsidy (30% Central + 30% State) on installing 3 HP to 10 HP solar water pumping systems.",
                            "Apply through State Renewable Energy Development Agencies (e.g. MPUVNL in MP, UPNEDA in UP).",
                            "Subsidies",
                            "Central",
                            "https://pmkusum.mnre.gov.in",
                            LocalDate.now().minusDays(14)
                    ),
                    new Scheme(
                            "Agriculture Infrastructure Fund (AIF)",
                            "Medium-long term debt financing facility for investment in viable projects for post-harvest management infrastructure and community farming assets.",
                            "Agri-entrepreneurs, Startups, Primary Agricultural Credit Societies, FPOs, and Self Help Groups.",
                            "Interest subvention of 3% per annum for loans up to ₹2 Crore for a maximum period of 7 years, along with CGTMSE credit guarantee.",
                            "Apply online on the centralized AIF portal at agriinfra.dac.gov.in.",
                            "Loans & Credit",
                            "Central",
                            "https://agriinfra.dac.gov.in",
                            LocalDate.now().minusDays(30)
                    ),
                    new Scheme(
                            "Bhavantar Bhugtan Yojana",
                            "Price Deficit Financing Scheme launched by Government of Madhya Pradesh to compensate farmers when market rates fall below the Minimum Support Price.",
                            "Farmers registered on the MP E-Uparjan portal cultivating notified crops (Soybean, Maize, Mustard, Pulses).",
                            "Direct DBT payment of the difference between the MSP and the actual APMC mandi modal selling price.",
                            "Register during sowing season on MP E-Uparjan portal (mpeuparjan.nic.in) through cooperative societies.",
                            "Subsidies",
                            "Madhya Pradesh",
                            "https://mpeuparjan.nic.in",
                            LocalDate.now().minusDays(22)
                    )
            );

            schemeRepository.saveAll(list);
            log.info("Seeded {} official government agricultural schemes.", list.size());
        }
    }

    private void seedNews() {
        if (newsRepository.count() == 0) {
            LocalDateTime now = LocalDateTime.now();
            List<News> list = List.of(
                    new News(
                            "Cabinet Approves MSP Hike for Rabi Crops 2026-27: Wheat MSP Raised to ₹2,425/Quintal",
                            "The Cabinet Committee on Economic Affairs (CCEA) has approved an increase in the Minimum Support Prices (MSP) for all mandated Rabi crops to ensure remunerative returns to growers.",
                            "The highest increase in MSP has been announced for Mustard (₹300/quintal) followed by Lentil (₹275/quintal) and Wheat (₹150/quintal). The revision aligns with the policy of fixing MSP at a minimum of 1.5 times the all-India weighted average cost of production.",
                            "Ministry of Agriculture & Farmers Welfare",
                            "https://pib.gov.in",
                            "Government",
                            "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&auto=format&fit=crop&q=80",
                            now.minusHours(4)
                    ),
                    new News(
                            "Monsoon Update & Agricultural Advisory: Central India Sowing Targets Exceeded",
                            "Favorable monsoon distribution across Madhya Pradesh, Maharashtra, and Gujarat has accelerated Kharif crop growth with reservoir storage levels reaching 82% capacity.",
                            "Agronomists advise farmers to maintain field bunding, practice broad bed furrow (BBF) planting for soybean, and avoid moisture stagnation during flowering stages. Routine weed management should be completed within the 25-30 day window.",
                            "ICAR - Central Institute of Agricultural Engineering",
                            "https://icar.org.in",
                            "Weather",
                            "https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?w=800&auto=format&fit=crop&q=80",
                            now.minusHours(12)
                    ),
                    new News(
                            "e-NAM Platform Crosses 1.75 Crore Registered Farmers Across 1,400 Mandis",
                            "The National Agriculture Market platform continues expanding inter-state and intra-state digital trade with new assaying parameters and automated weighing integrations.",
                            "Farmers who trade on e-NAM report 10-15% higher modal price realizations compared to traditional closed physical auctions. Direct bank settlement within 24 hours has minimized payment defaults.",
                            "Small Farmers' Agribusiness Consortium (SFAC)",
                            "https://enam.gov.in",
                            "Mandi",
                            "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&auto=format&fit=crop&q=80",
                            now.minusDays(1)
                    ),
                    new News(
                            "Advisory on Micro-Irrigation Maintenance: Optimize Drip Emitters Before Rabi Season",
                            "State Horticulture Department issues advisory for farmers utilizing drip and sprinkler networks to conduct lateral acid flushing and sand filter backwashing.",
                            "Flushing with dilute hydrochloric or phosphoric acid (pH 4.0-5.0) dissolves calcium carbonate scaling and unclogs drippers, restoring 98% water distribution uniformity and lowering pumping electricity costs.",
                            "National Horticulture Mission",
                            "https://nhm.nic.in",
                            "Farming",
                            "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=800&auto=format&fit=crop&q=80",
                            now.minusDays(2)
                    ),
                    new News(
                            "PM-KUSUM Scheme: Solar Agriculture Feeder Subsidies Open for Applications",
                            "Farmers and cooperatives can now apply for 60% subsidized grid-connected solar power plants on fallow or barren agricultural lands.",
                            "Under Component C of PM-KUSUM, farmers with existing electric pumps can solarize their pumpsets and sell surplus daytime generated electricity back to state power distribution companies (DISCOMs).",
                            "Ministry of New and Renewable Energy",
                            "https://mnre.gov.in",
                            "Technology",
                            "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800&auto=format&fit=crop&q=80",
                            now.minusDays(3)
                    ),
                    new News(
                            "Gram and Mustard Market Arrival Trends: Steady Demand in MP & Rajasthan Mandis",
                            "Arrivals of pulses and oilseeds across Bhopal, Indore, and Kota mandis remained firm this week with quality grading commanding premium pricing above modal rates.",
                            "Traders note robust procurement demand from domestic processing mills. Farmers are advised to dry harvested grains to below 10% moisture content prior to mandi transport to prevent quality discounts.",
                            "Agmarknet Market Intelligence Unit",
                            "https://agmarknet.gov.in",
                            "Mandi",
                            "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=80",
                            now.minusDays(4)
                    ),
                    new News(
                            "Organic Farming Clusters in Central India Achieve PGS Certification",
                            "Over 350 farmer clusters under the Paramparagat Krishi Vikas Yojana (PKVY) received organic certification, unlocking premium export market access for organic wheat and soybean.",
                            "Participatory Guarantee System (PGS) certification eliminates expensive third-party audit fees, empowering farmer groups to directly market certified organic produce at 25-35% price premiums.",
                            "National Centre for Organic and Natural Farming",
                            "https://pgsindia-ncof.gov.in",
                            "Agriculture",
                            "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80",
                            now.minusDays(5)
                    ),
                    new News(
                            "Weather Alert: Mild Heat Wave Forecasted in Western Plains, Irrigation Advised",
                            "Indian Meteorological Department (IMD) predicts daytime temperatures 2-3°C above normal across Rajasthan and northern Madhya Pradesh over the next 48 hours.",
                            "Farmers are advised to provide light, frequent irrigation to standing horticulture crops during early morning or late evening hours to mitigate heat stress.",
                            "India Meteorological Department (IMD)",
                            "https://mausam.imd.gov.in",
                            "Weather",
                            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
                            now.minusDays(6)
                    )
            );

            newsRepository.saveAll(list);
            log.info("Seeded {} agricultural news and advisory articles.", list.size());
        }
    }

    private void seedFavorites() {
        if (favoriteRepository.count() == 0) {
            userRepository.findByEmail("farmer@krishikendra.gov.in").ifPresent(farmer -> {
                favoriteRepository.save(new Favorite(farmer, "Wheat", "Bhopal"));
                favoriteRepository.save(new Favorite(farmer, "Soybean", "Indore"));
                favoriteRepository.save(new Favorite(farmer, "Mustard", "Jaipur"));
            });
            log.info("Seeded initial favorite crop bookmarks for demo farmer.");
        }
    }
}
