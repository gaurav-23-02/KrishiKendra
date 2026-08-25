import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

const translations = {
  en: {
    app_name: "Krishi Kendra",
    app_tagline: "Smart Agriculture Information Platform",
    nav_dashboard: "Dashboard",
    nav_mandi: "Market Prices",
    nav_trends: "Price Trends",
    nav_weather: "Weather",
    nav_schemes: "Govt Schemes",
    nav_news: "Agri News",
    nav_assistant: "AI Assistant",
    nav_profile: "Profile",
    nav_admin: "Admin",
    nav_login: "Login",
    nav_register: "Register",
    nav_logout: "Logout",
    
    hero_title: "Smart Decisions for Prosperous Farmers",
    hero_subtitle: "Access live mandi market prices, weather forecasts, government subsidies, and AI-guided agricultural advisories — all in one trusted hub.",
    
    card_weather_title: "Weather in",
    card_mandi_title: "Mandi Market Rates",
    card_schemes_title: "Government Schemes",
    card_news_title: "News & Advisories",
    card_favorites_title: "My Saved Crops & Mandis",
    card_quick_actions: "Quick Actions",
    
    btn_check_mandi: "Check Mandi Prices",
    btn_view_weather: "Weather Forecast",
    btn_view_schemes: "Government Schemes",
    btn_view_news: "Agricultural News",
    btn_view_trends: "Price Trends",
    btn_ask_ai: "Ask AI Assistant",
    btn_search: "Search",
    btn_reset: "Reset",
    btn_apply_now: "Official Portal",
    btn_view_details: "View Details",
    
    lbl_state: "State",
    lbl_district: "District",
    lbl_market: "Market / Mandi",
    lbl_commodity: "Commodity / Crop",
    lbl_date: "Date",
    lbl_min_price: "Min Price",
    lbl_max_price: "Max Price",
    lbl_modal_price: "Modal Price",
    lbl_quintal: "/ quintal",
    lbl_humidity: "Humidity",
    lbl_wind: "Wind",
    lbl_feels_like: "Feels like",
    lbl_advisories: "Agro-Advisory",
    
    empty_mandi: "No mandi prices found for the selected filters.",
    empty_schemes: "No government schemes matched your search.",
    empty_news: "No agricultural news found for this category.",
    empty_favorites: "You have not bookmarked any crops or markets yet.",
    
    loading: "Loading agricultural data...",
  },
  hi: {
    app_name: "कृषि केंद्र",
    app_tagline: "स्मार्ट कृषि सूचना मंच",
    nav_dashboard: "डैशबोर्ड",
    nav_mandi: "मंडी भाव",
    nav_trends: "भाव रुझान",
    nav_weather: "मौसम",
    nav_schemes: "सरकारी योजनाएं",
    nav_news: "कृषि समाचार",
    nav_assistant: "एआई सहायक",
    nav_profile: "प्रोफ़ाइल",
    nav_admin: "व्यवस्थापक",
    nav_login: "लॉग इन",
    nav_register: "पंजीकरण",
    nav_logout: "लॉग आउट",
    
    hero_title: "समृद्ध किसान, सशक्त भारत",
    hero_subtitle: "लाइव मंडी भाव, मौसम पूर्वानुमान, सरकारी योजनाएं और एआई कृषि सलाह — सब कुछ एक ही सरल मंच पर।",
    
    card_weather_title: "मौसम पूर्वानुमान:",
    card_mandi_title: "आज का मंडी भाव",
    card_schemes_title: "प्रमुख सरकारी योजनाएं",
    card_news_title: "कृषि समाचार एवं परामर्श",
    card_favorites_title: "मेरी पसंदीदा फसलें व मंडियां",
    card_quick_actions: "त्वरित सेवाएं",
    
    btn_check_mandi: "मंडी भाव देखें",
    btn_view_weather: "मौसम रिपोर्ट",
    btn_view_schemes: "सरकारी योजनाएं",
    btn_view_news: "कृषि समाचार",
    btn_view_trends: "भाव चार्ट देखें",
    btn_ask_ai: "एआई सहायक से पूछें",
    btn_search: "खोजें",
    btn_reset: "रीसेट",
    btn_apply_now: "आधिकारिक पोर्टल",
    btn_view_details: "विस्तार से देखें",
    
    lbl_state: "राज्य",
    lbl_district: "जिला",
    lbl_market: "मंडी",
    lbl_commodity: "फसल / जींस",
    lbl_date: "दिनांक",
    lbl_min_price: "न्यूनतम भाव",
    lbl_max_price: "अधिकतम भाव",
    lbl_modal_price: "मॉडल भाव (औसत)",
    lbl_quintal: "/ क्विंटल",
    lbl_humidity: "आर्द्रता",
    lbl_wind: "हवा",
    lbl_feels_like: "महसूस",
    lbl_advisories: "कृषि परामर्श",
    
    empty_mandi: "चयनित फिल्टर के लिए कोई मंडी भाव नहीं मिला।",
    empty_schemes: "कोई सरकारी योजना नहीं मिली।",
    empty_news: "इस श्रेणी में कोई समाचार उपलब्ध नहीं है।",
    empty_favorites: "आपने अभी तक कोई पसंदीदा फसल या मंडी नहीं जोड़ी है।",
    
    loading: "कृषि डेटा लोड हो रहा है...",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('krishi_lang');
    return saved || 'en';
  });

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
    localStorage.setItem('krishi_lang', nextLang);
  };

  const setSpecificLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('krishi_lang', lang);
  };

  const t = (key) => {
    return (translations[language] && translations[language][key]) || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, setSpecificLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
