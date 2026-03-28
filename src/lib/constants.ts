export const BUILDING_TYPES = [
  { value: "hospital", label: "Hospital / Healthcare Facility", icon: "🏥" },
  { value: "school", label: "School / Educational Institution", icon: "🏫" },
  { value: "airport", label: "Airport / Transportation Hub", icon: "✈️" },
  { value: "data_center", label: "Data Center / Server Farm", icon: "🖥️" },
  { value: "office", label: "Commercial Office Building", icon: "🏢" },
  { value: "industrial", label: "Industrial / Manufacturing Plant", icon: "🏭" },
  { value: "residential_highrise", label: "Residential High-Rise / Condo", icon: "🏗️" },
  { value: "retail", label: "Retail / Shopping Centre", icon: "🏬" },
  { value: "arena", label: "Arena / Sports & Entertainment Venue", icon: "🏟️" },
  { value: "hotel", label: "Hotel / Hospitality", icon: "🏨" },
  { value: "museum", label: "Museum / Cultural Centre", icon: "🏛️" },
  { value: "parking", label: "Parking Structure / Garage", icon: "🅿️" },
  { value: "wastewater", label: "Wastewater / Water Treatment Plant", icon: "💧" },
  { value: "transit", label: "Transit Station / LRT / Metro", icon: "🚇" },
  { value: "government", label: "Government / Civic Building", icon: "🏛️" },
  { value: "laboratory", label: "Research Laboratory / University", icon: "🔬" },
] as const;

export const CANADIAN_PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
] as const;

export const PROJECT_SCALES = [
  { value: "small", label: "Small  (< 500 m²)" },
  { value: "medium", label: "Medium  (500 – 5,000 m²)" },
  { value: "large", label: "Large  (5,000 – 50,000 m²)" },
  { value: "campus", label: "Campus / Campus-Scale  (> 50,000 m²)" },
] as const;

export const VOLTAGE_CLASSES = [
  { value: "120_240", label: "120/240 V Single-Phase" },
  { value: "120_208", label: "120/208 V Three-Phase" },
  { value: "347_600", label: "347/600 V Three-Phase (Standard Canada)" },
  { value: "4160", label: "4,160 V Medium Voltage" },
  { value: "13800", label: "13,800 V Medium Voltage" },
  { value: "25000", label: "25,000 V High Voltage" },
] as const;

export type BuildingType = typeof BUILDING_TYPES[number]["value"];
export type Province = typeof CANADIAN_PROVINCES[number]["value"];
export type ProjectScale = typeof PROJECT_SCALES[number]["value"];
export type VoltageClass = typeof VOLTAGE_CLASSES[number]["value"];
