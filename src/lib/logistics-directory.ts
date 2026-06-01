export type LogisticsServiceType =
  | "Incentive-based Recycler"
  | "PSP Collector"
  | "Specialized E-Waste Hub"
  | "Material Recovery Facility";

export type WasteCategory =
  | "PET Plastics"
  | "E-waste"
  | "General Municipal"
  | "Hazardous"
  | "Carton & Paper"
  | "Metals & Glass";

export type WasteLogisticsProvider = {
  id: string;
  companyName: string;
  primaryRegion: "Lagos" | "Ogun";
  lgaCoverage: string[];
  wasteCategories: WasteCategory[];
  serviceType: LogisticsServiceType;
  baseAddress?: string;
  coordinates?: [number, number]; // [Latitude, Longitude] for putting on the map
};

export const logisticsDirectory: WasteLogisticsProvider[] = [
  // --- INCENTIVE-BASED RECYCLERS ---
  {
    id: "rec_wecyclers_island",
    companyName: "Wecyclers - Headquarters",
    primaryRegion: "Lagos",
    lgaCoverage: ["Lagos Island", "Surulere", "Mainland"],
    wasteCategories: ["PET Plastics", "Carton & Paper"],
    serviceType: "Incentive-based Recycler",
    baseAddress: "149 Bamgbose Street, Lagos Island",
    coordinates: [6.4526, 3.3985], 
  },
  {
    id: "rec_wecyclers_surulere",
    companyName: "Wecyclers Hub - Surulere",
    primaryRegion: "Lagos",
    lgaCoverage: ["Surulere", "Pako Aguda", "Ojuelegba"],
    wasteCategories: ["PET Plastics", "Carton & Paper"],
    serviceType: "Incentive-based Recycler",
    coordinates: [6.5000, 3.3500],
  },
  {
    id: "rec_scrapays_magodo",
    companyName: "Scrapays Base",
    primaryRegion: "Lagos",
    lgaCoverage: ["Kosofe", "Ikeja", "Ota Border"],
    wasteCategories: ["PET Plastics", "Metals & Glass", "Carton & Paper"],
    serviceType: "Incentive-based Recycler",
    baseAddress: "2 Omoniyi Street, Magodo, Shangisha",
    coordinates: [6.6133, 3.3768],
  },
  {
    id: "rec_scrapays_ota",
    companyName: "Scrapays Agent Network - Ota",
    primaryRegion: "Ogun",
    lgaCoverage: ["Ado-Odo/Ota"],
    wasteCategories: ["PET Plastics", "Metals & Glass", "Carton & Paper"],
    serviceType: "Incentive-based Recycler",
    coordinates: [6.6908, 3.2386],
  },

  // --- SPECIALIZED E-WASTE HUBS ---
  {
    id: "rec_hinckley",
    companyName: "Hinckley E-Waste Recycling",
    primaryRegion: "Lagos",
    lgaCoverage: ["Ikeja", "Oshodi-Isolo", "Mainland"],
    wasteCategories: ["E-waste", "Hazardous"],
    serviceType: "Specialized E-Waste Hub",
    baseAddress: "Ojota / Ikeja Industrial Axis",
    coordinates: [6.5866, 3.3766],
  },
  {
    id: "rec_epron_collection",
    companyName: "EPRON Official Drop-off Point",
    primaryRegion: "Lagos",
    lgaCoverage: ["Surulere", "Mainland"],
    wasteCategories: ["E-waste"],
    serviceType: "Specialized E-Waste Hub",
    coordinates: [6.5166, 3.3833],
  },

  // --- OFFICIAL PSP COLLECTORS (LAWMA - LAGOS) ---
  {
    id: "psp_alimosho_walius",
    companyName: "Walius Nigeria Ltd (LAWMA PSP)",
    primaryRegion: "Lagos",
    lgaCoverage: ["Alimosho"],
    wasteCategories: ["General Municipal"],
    serviceType: "PSP Collector",
  },
  {
    id: "psp_ikeja_visionscape",
    companyName: "Metro Waste / Ikeja PSP Zone",
    primaryRegion: "Lagos",
    lgaCoverage: ["Ikeja", "Somolu"],
    wasteCategories: ["General Municipal"],
    serviceType: "PSP Collector",
  },
  {
    id: "psp_eti_osa",
    companyName: "Island Waste Management (LAWMA PSP)",
    primaryRegion: "Lagos",
    lgaCoverage: ["Eti-Osa", "Lekki"],
    wasteCategories: ["General Municipal"],
    serviceType: "PSP Collector",
  },

  // --- OFFICIAL PSP COLLECTORS (OGWAMA - OGUN) ---
  {
    id: "psp_ogun_abeokuta_south",
    companyName: "OGWAMA Zone A Operators",
    primaryRegion: "Ogun",
    lgaCoverage: ["Abeokuta South", "Abeokuta North"],
    wasteCategories: ["General Municipal"],
    serviceType: "PSP Collector",
  },
  {
    id: "psp_ogun_ota",
    companyName: "Gateway Waste / Ota PSP Zone",
    primaryRegion: "Ogun",
    lgaCoverage: ["Ado-Odo/Ota", "Ifo"],
    wasteCategories: ["General Municipal"],
    serviceType: "PSP Collector",
  },
  {
    id: "psp_ogun_sagamu",
    companyName: "Remo Cleaners (OGWAMA PSP)",
    primaryRegion: "Ogun",
    lgaCoverage: ["Sagamu", "Remo North"],
    wasteCategories: ["General Municipal"],
    serviceType: "PSP Collector",
  }
];
