/**
 * ElectricGPT Blueprint Engine
 * Assembles structured electrical design blueprints from the local knowledge base.
 * No external API calls — all content sourced from reference documents.
 */

import {
  CEC_SECTION_6,
  CEC_SECTION_8,
  CEC_SECTION_10,
  CEC_SECTION_32,
  CEC_SECTION_46,
  CSA_C282,
  CANULC_S524,
  NBC_2020,
  BUILDING_SPECIFIC,
  DESIGN_CHECKLIST,
  VOLTAGE_DROP_REF,
  PANEL_NAMING,
  TRANSFORMER_REF,
} from "./knowledge-base";

import type { BuildingType, Province, ProjectScale, VoltageClass } from "./constants";

export interface BlueprintParams {
  buildingType: BuildingType;
  province: Province;
  scale?: ProjectScale;
  voltage?: VoltageClass;
  details?: string;
}

// ─── Province-specific notes ─────────────────────────────────────────────────

const PROVINCE_NOTES: Record<string, { utility: string; adoptedCode: string; notes: string[] }> = {
  AB: {
    utility: "ATCO Electric / ENMAX / EPCOR",
    adoptedCode: "Alberta Electrical Utility Code + CEC C22.1",
    notes: [
      "Alberta Safety Codes Act governs — permits issued by Safety Codes Officers (SCO)",
      "AESO grid connection: Alberta Electric System Operator interconnection review for loads >1 MW",
      "Single-line approval required from ATCO/ENMAX prior to service installation",
    ],
  },
  BC: {
    utility: "BC Hydro / FortisBC",
    adoptedCode: "BC Electrical Safety Regulation (BC Reg 100/2004) — adopts CEC with BC amendments",
    notes: [
      "Technical Safety BC issues electrical permits; licensed electrical contractor required",
      "BC Hydro Green Building Code Incentives may apply for energy-efficient systems",
      "Seismic Zone considerations per NBCC — brace all equipment >15 kg per BCBC",
    ],
  },
  MB: {
    utility: "Manitoba Hydro",
    adoptedCode: "Manitoba Electrical Safety Act + CEC C22.1",
    notes: [
      "Manitoba Hydro provides service design — submit load forecast and single-line early",
      "Ground-source heat pump systems common — coordinate with mechanical for electrical capacity",
    ],
  },
  NB: {
    utility: "NB Power",
    adoptedCode: "Electrical Installation and Inspection Act (NB) + CEC C22.1",
    notes: [
      "NB Power Section 3.2.2: Padmount transformer minimum 6 m from building",
      "New Brunswick requires permits from Technical Inspection Services (TIS)",
      "Bilingual signage requirement for public-facing facilities",
    ],
  },
  NL: {
    utility: "Newfoundland Power / NL Hydro",
    adoptedCode: "Electrical Inspection Act (NL) + CEC C22.1",
    notes: [
      "Newfoundland Power engineering review required for loads >500 kVA",
      "Cold climate: heat tracing on outdoor conduits, minimum -40°C rated equipment outdoors",
    ],
  },
  NS: {
    utility: "Nova Scotia Power (NSPI)",
    adoptedCode: "NS Electrical Safety Act + CEC C22.1",
    notes: [
      "Nova Scotia Power Technical Bulletin TB-100 governs service installations",
      "Halifax area: underground service preferred per HRM infrastructure standards",
    ],
  },
  NT: {
    utility: "NWT Power Corporation",
    adoptedCode: "Safety Act (NWT) + CEC C22.1",
    notes: [
      "Permafrost zone: special foundation and conduit burial requirements",
      "Diesel backup generation standard for remote communities",
    ],
  },
  NU: {
    utility: "Qulliq Energy Corporation",
    adoptedCode: "Safety Act (NU) + CEC C22.1",
    notes: [
      "Arctic climate: all equipment rated for -50°C minimum",
      "Qulliq Energy coordinates all power supply — submit load profile 18+ months in advance",
    ],
  },
  ON: {
    utility: "Hydro One / Local Distribution Companies (LDC)",
    adoptedCode: "Electrical Safety Authority (ESA) + Ontario Electrical Safety Code (OESC) based on CEC",
    notes: [
      "ESA permit required before energization — electrical contractor must register work",
      "Ontario Building Code (OBC) Division B Part 3 governs fire separation for electrical rooms",
      "Green Energy Act incentives available; net metering available from LDC",
      "Toronto Hydro / Ottawa Hydro may have additional requirements — confirm with LDC",
    ],
  },
  PE: {
    utility: "Maritime Electric",
    adoptedCode: "PEI Electrical Inspection Act + CEC C22.1",
    notes: [
      "Maritime Electric engineering review required for new commercial services",
      "Island grid: limited fault current — confirm available fault current with Maritime Electric",
    ],
  },
  QC: {
    utility: "Hydro-Québec",
    adoptedCode: "Loi sur les installations électriques (LIE) + Code de construction du Québec, Chapter V (électricité)",
    notes: [
      "Hydro-Québec B-116 standard governs service installations",
      "Régie du bâtiment du Québec (RBQ) issues electrical contractor licences and permits",
      "Bilingual labelling mandatory per OLF requirements",
      "Hydro-Québec underground CSPE conduit system for LV services in urban areas",
    ],
  },
  SK: {
    utility: "SaskPower",
    adoptedCode: "Saskatchewan Electrical Licensing Act + CEC C22.1",
    notes: [
      "SaskPower Technical Standards govern interconnection — TIA required for loads >250 kVA",
      "Saskatchewan Labour Relations and Workplace Safety issues permits",
    ],
  },
  YT: {
    utility: "Yukon Energy / ATCO Electric Yukon",
    adoptedCode: "Yukon Electrical Protection Act + CEC C22.1",
    notes: [
      "Subarctic climate: all outdoor equipment rated for -50°C",
      "Coordinate with Yukon Energy for grid interconnection — isolated system considerations",
    ],
  },
};

// ─── Building-type load rule lookup ──────────────────────────────────────────

function getLoadRule(buildingType: BuildingType): { rule: string; wPerM2: string; demandFactor: string } {
  const map: Record<string, { rule: string; wPerM2: string; demandFactor: string }> = {
    hospital: {
      rule: "CEC Rule 8-206",
      wPerM2: "20 W/m² general areas; 100 W/m² high-intensity areas (OR, ICU, trauma)",
      demandFactor: "80% (≤ 900 m²) / 80% first 900 m² + 65% balance (> 900 m²)",
    },
    school: {
      rule: "CEC Rule 8-204",
      wPerM2: "50 W/m² classroom areas + 10 W/m² remaining areas",
      demandFactor: "75% (≤ 900 m²) / 75% first 900 m² + 50% balance (> 900 m²)",
    },
    hotel: {
      rule: "CEC Rule 8-208",
      wPerM2: "20 W/m² building area",
      demandFactor: "80% (≤ 900 m²) / 80% first 900 m² + 65% balance (> 900 m²)",
    },
    residential_highrise: {
      rule: "CEC Rule 8-202 (apartment)",
      wPerM2: "Per apartment unit: 5,000 W + 1,000 W per 90 m² — then Table 14 demand factors",
      demandFactor: "Table 14 — reduces significantly with number of units (10 units: ~48%; 50 units: ~30%)",
    },
    office: {
      rule: "CEC Rule 8-210 + CEC Table 14",
      wPerM2: "50 W/m² (lighting + receptacles) per Table 14",
      demandFactor: "CEC Table 14 demand factors by occupancy",
    },
    industrial: {
      rule: "CEC Rule 8-210 + CEC Table 14",
      wPerM2: "Full connected load — industrial process loads at 100% unless diversity documented",
      demandFactor: "Per engineering analysis; diversity factor applied to motor loads per CEC Rule 8-300 series",
    },
    retail: {
      rule: "CEC Rule 8-210 + CEC Table 14",
      wPerM2: "55 W/m² (lighting + receptacles + HVAC) per Table 14",
      demandFactor: "CEC Table 14 demand factors",
    },
    airport: {
      rule: "CEC Rule 8-210 + CEC Table 14",
      wPerM2: "30 W/m² general areas; special airport systems (jetways, baggage) at full rating",
      demandFactor: "Engineering analysis required — multiple occupancy classifications",
    },
    data_center: {
      rule: "CEC Rule 8-210",
      wPerM2: "IT load: 1,000–5,000 W/m² (Tier classification dependent) — per ASHRAE TC9.9",
      demandFactor: "Design IT load at 100%; UPS and cooling at 100%; use commissioned load for final calc",
    },
    arena: {
      rule: "CEC Rule 8-210 + CEC Table 14",
      wPerM2: "30 W/m² concourse; 100 W/m² ice surface/playing area (broadcast lighting)",
      demandFactor: "CEC Table 14 + engineering analysis for event-based loads",
    },
    museum: {
      rule: "CEC Rule 8-210 + CEC Table 14",
      wPerM2: "35 W/m² exhibition areas; specialty lighting at full rating",
      demandFactor: "CEC Table 14",
    },
    parking: {
      rule: "CEC Rule 8-210 + CEC Table 14",
      wPerM2: "5 W/m² lighting; EVSE at 100% per CEC Rule 8-500 (EVSE rules)",
      demandFactor: "Engineering analysis — EVSE demand factoring per local utility guidance",
    },
    wastewater: {
      rule: "CEC Rule 8-210 (industrial)",
      wPerM2: "Full process load at 100% — critical infrastructure, no demand factor",
      demandFactor: "100% — standby power for all critical process equipment",
    },
    transit: {
      rule: "CEC Rule 8-210 + CEC Table 14",
      wPerM2: "25 W/m² station areas; traction power systems separate calculation",
      demandFactor: "Engineering analysis — traction power outside building electrical scope",
    },
    government: {
      rule: "CEC Rule 8-210 + CEC Table 14",
      wPerM2: "50 W/m² office areas; secure areas may require isolated power",
      demandFactor: "CEC Table 14 demand factors",
    },
    laboratory: {
      rule: "CEC Rule 8-210",
      wPerM2: "100–150 W/m² for active lab areas (high plug loads, fume hoods, equipment)",
      demandFactor: "Per engineering analysis — diversity factor for simultaneous lab use",
    },
  };
  return map[buildingType] ?? map.office;
}

// ─── Emergency power requirement lookup ──────────────────────────────────────

function requiresEmergencyPower(buildingType: BuildingType): boolean {
  return ["hospital", "airport", "data_center", "arena", "wastewater", "transit", "government", "laboratory"].includes(buildingType);
}

function requiresCSAC282(buildingType: BuildingType): boolean {
  return ["hospital", "airport", "arena", "government", "laboratory"].includes(buildingType);
}

function requiresFireAlarm(buildingType: BuildingType): boolean {
  return true; // All commercial/institutional require fire alarm per NBC
}

// ─── Main Blueprint Assembly ──────────────────────────────────────────────────

export function generateBlueprint(params: BlueprintParams): string {
  const { buildingType, province, scale, voltage, details } = params;

  const bt = BUILDING_TYPES_MAP[buildingType] ?? buildingType;
  const pv = PROVINCE_NOTES[province];
  const loadRule = getLoadRule(buildingType);
  const bspec = (BUILDING_SPECIFIC as Record<string, unknown>)[buildingType] as Record<string, string[]> | undefined;
  const scaleLabel = scale ? SCALE_MAP[scale] : null;
  const voltageLabel = voltage ? VOLTAGE_MAP[voltage] : "347/600 V Three-Phase (standard Canada)";

  const lines: string[] = [];

  // ─── Section 1: Project Overview ──────────────────────────────────────────
  lines.push(`# Project Overview`);
  lines.push(`**Facility Type:** ${bt}`);
  lines.push(`**Province / Territory:** ${province ? `${PROV_NAMES[province] ?? province}, Canada` : "Canada"}`);
  if (scaleLabel) lines.push(`**Project Scale:** ${scaleLabel}`);
  lines.push(`**Primary Voltage Class:** ${voltageLabel}`);
  if (details) lines.push(`**Additional Notes:** ${details}`);
  lines.push(``);
  lines.push(`> This blueprint references: CEC CSA C22.1:24 · NBC 2020 · CSA C282-2015 · CAN/ULC-S524:2014 AMD1 · CSA Z32 · NFPA 72 / 101 / 110`);
  lines.push(`> Always verify with your local AHJ (Authority Having Jurisdiction) and licensed engineer before proceeding.`);
  lines.push(``);

  if (pv) {
    lines.push(`**Local Utility:** ${pv.utility}`);
    lines.push(`**Adopted Electrical Code:** ${pv.adoptedCode}`);
    lines.push(`**Province-Specific Requirements:**`);
    pv.notes.forEach((n) => lines.push(`- ${n}`));
    lines.push(``);
  }

  // ─── Section 2: Applicable Codes & Standards ──────────────────────────────
  lines.push(`# Applicable Codes & Standards`);
  lines.push(`**CEC CSA C22.1:24** — Canadian Electrical Code, Part I (2024 Edition)`);
  lines.push(`**NBC 2020** — National Building Code of Canada 2020`);
  lines.push(`**CSA C282-2015** — Emergency Electrical Power Supply for Buildings`);
  lines.push(`**CAN/ULC-S524:2014 AMD1** — Standard for the Installation of Fire Alarm Systems`);
  lines.push(`**CSA Z32** — Electrical Safety in Health Care Facilities (healthcare projects)`);
  lines.push(`**NFPA 72** — National Fire Alarm and Signaling Code`);
  lines.push(`**NFPA 101** — Life Safety Code`);
  lines.push(`**NFPA 110** — Standard for Emergency and Standby Power Systems`);
  lines.push(`**NFPA 20** — Standard for the Installation of Stationary Pumps for Fire Protection`);
  lines.push(`**CSA Z462** — Workplace Electrical Safety (Arc Flash)`);
  lines.push(`**IEEE 1584** — Arc Flash Hazard Calculations`);
  lines.push(`**ASHRAE 90.1** — Energy Standard for Buildings (lighting power density)`);
  lines.push(``);

  // ─── Section 3: Power Distribution ───────────────────────────────────────
  lines.push(`# Power Distribution`);
  lines.push(`## Service Entrance`);
  lines.push(`- **CEC Rule ${CEC_SECTION_6.meterLocation.rule}**: Meter location — ${CEC_SECTION_6.meterLocation.mountHeight} above finished floor; CT cabinet required for services >200 A`);
  lines.push(`- **CEC Rule 6-206**: Consumer's service equipment location — max 5.0 m from facility entrance`);
  lines.push(`- **Working Clearance (CEC Rule ${CEC_SECTION_6.workingSpace.rule})**: ${CEC_SECTION_6.workingSpace.lessThan1200AorLessThan750V} (standard); ${CEC_SECTION_6.workingSpace.greaterOrEqualTo1200AorGreaterOrEqualTo750V} (≥ 1,200 A or ≥ 750 V)`);
  lines.push(`- Underground conductors: derate per CEC Table D11 (×0.886 for conduit bundling)`);
  lines.push(`- Note all equipment rated for 75°C on drawings`);
  lines.push(``);

  lines.push(`## Transformer & Vault`);
  if (voltage === "347_600" || voltage === "4160" || voltage === "13800" || voltage === "25000") {
    lines.push(`- **Padmount Transformer Setback**: ${CEC_SECTION_10.padmountTransformer.setback}`);
    lines.push(`- **Ground Grid (CEC Rule ${CEC_SECTION_10.groundingElectrodes.rule})**: ${CEC_SECTION_10.padmountTransformer.groundGrid}; ${CEC_SECTION_10.padmountTransformer.toBuilding}`);
    lines.push(`- **Blast Wall / Current-Limiting Fuses**: required per utility specification`);
  }
  lines.push(`- Transformer sizing: base on calculated demand load + 20% spare capacity`);
  lines.push(`- Primary protection: ${TRANSFORMER_REF.primaryProtection}`);
  lines.push(`- K-rated: ${TRANSFORMER_REF.kRated}`);
  lines.push(`- Heat loss: ${TRANSFORMER_REF.heatLoss}`);
  lines.push(`- Short-circuit: ${TRANSFORMER_REF.impedance}`);
  lines.push(``);

  lines.push(`## Distribution Panel Naming Convention`);
  lines.push(`- Convention: **${PANEL_NAMING.convention}**`);
  lines.push(`- Example: \`${PANEL_NAMING.example}\``);
  lines.push(`- Voltage codes: 2=120/208V, 4=120/240V, 6=347/600V, 12=MV 12kV`);
  lines.push(`- Distribution: N=Normal, E=Emergency/Essential, B=Both`);
  lines.push(`- Type: N=Normal, E=Emergency, D=Distribution, U=Uninterruptible, V=Vital`);
  lines.push(``);

  // ─── Section 4: Load Calculations ────────────────────────────────────────
  lines.push(`# Load Calculations`);
  lines.push(`**Primary Rule: ${loadRule.rule}**`);
  lines.push(`- **Connected Load Basis**: ${loadRule.wPerM2}`);
  lines.push(`- **Demand Factor**: ${loadRule.demandFactor}`);
  lines.push(``);
  lines.push(`**General Load Calc Rules (CEC Section 8):**`);
  lines.push(`- Voltage drop limits — ${CEC_SECTION_8.voltageDropLimits.feederOrBranch}; ${CEC_SECTION_8.voltageDropLimits.totalServiceToLoad}`);
  lines.push(`- Continuous loads: ${CEC_SECTION_8.continuousLoadRule.sizing80pct} (80% rated device) or ${CEC_SECTION_8.continuousLoadRule.sizing100pct} (100% rated device)`);
  lines.push(`- Max outlets per circuit — ${CEC_SECTION_8.maxOutletsPerCircuit.entries.join("; ")}`);
  lines.push(``);
  lines.push(`**Voltage Drop Reference:**`);
  lines.push(`- Formula: ${VOLTAGE_DROP_REF.formula}`);
  lines.push(`- ${VOLTAGE_DROP_REF.where}`);
  lines.push(`- ${VOLTAGE_DROP_REF.conductorSizing}`);
  lines.push(`- Exterior lighting: ${VOLTAGE_DROP_REF.exteriorLighting}`);
  lines.push(``);

  // ─── Section 5: Service Entrance & Grounding ─────────────────────────────
  lines.push(`# Service Entrance & Grounding`);
  lines.push(`**CEC Section 10 — Grounding and Bonding**`);
  lines.push(`- Objective: ${CEC_SECTION_10.objective}`);
  lines.push(`- Grounding electrodes (CEC Rule ${CEC_SECTION_10.groundingElectrodes.rule}): ${CEC_SECTION_10.groundingElectrodes.rodElectrode}`);
  lines.push(`- No objectionable current on grounding conductors (CEC Rule 10-100)`);
  lines.push(``);
  lines.push(`**Design Checklist — Service & Grounding Items:**`);
  DESIGN_CHECKLIST.sitePlan.forEach((item) => lines.push(`- [ ] ${item}`));
  lines.push(``);

  // ─── Section 6: Emergency & Standby Power ────────────────────────────────
  lines.push(`# Emergency & Standby Power`);

  if (requiresCSAC282(buildingType)) {
    lines.push(`## CSA C282-2015 — Emergency Electrical Power Supply`);
    lines.push(`**This facility requires a CSA C282 compliant emergency power system.**`);
    lines.push(``);
    lines.push(`**Generator Requirements (CSA C282 Cl. 6):**`);
    CSA_C282.generatorPlantRequirements.location.notes.forEach((r) => lines.push(`- ${r}`));
    lines.push(`- ${CSA_C282.generatorPlantRequirements.ventilation.required}`);
    lines.push(`- ${CSA_C282.generatorPlantRequirements.loadTestingProvisions}`);
    lines.push(``);
    lines.push(`**Generator Sizing (CSA C282 Cl. 7):**`);
    lines.push(`- ${CSA_C282.generatorSizing.brakePower}`);
    lines.push(`- Fuel supply — Health care: ${CSA_C282.generatorSizing.fuelSupply.healthCareFacilities}`);
    lines.push(`- Fuel supply — Other: ${CSA_C282.generatorSizing.fuelSupply.nonHCF}`);
    lines.push(``);
    lines.push(`**Transfer Switch Requirements (CSA C282 Cl. 9):**`);
    lines.push(`- ${CSA_C282.transferSwitches.phaseRotation}`);
    lines.push(`- Transfer timing: ${CSA_C282.transferSwitches.automaticTransfer.timing}`);
    lines.push(`- ${CSA_C282.transferSwitches.manualBypass}`);
    lines.push(``);
    lines.push(`**Load Classification (CSA C282 Cl. 4):**`);
    lines.push(`- **Class 1 (≤10 s)**: Life safety — Exit lighting, fire alarm, emergency lighting, elevators (where required), emergency communication`);
    lines.push(`- **Class 2 (≤30 s)**: Critical — Surgical lighting, ICU, NICU, life support equipment`);
    lines.push(`- **Class 3 (>30 s)**: Equipment protection — Process loads, IT systems, general HVAC`);
    lines.push(``);
    lines.push(`**Generator Room Requirements:**`);
    DESIGN_CHECKLIST.generator.forEach((item) => lines.push(`- [ ] ${item}`));
  } else if (requiresEmergencyPower(buildingType)) {
    lines.push(`This facility requires emergency/standby power per NBC 2020 and NFPA 110.`);
    lines.push(``);
    lines.push(`**NFPA 110 Level 1 (10-second restoration):**`);
    lines.push(`- Required for: Exit signs, emergency egress lighting, fire alarm, sprinkler pump, elevators serving floors above 18 m`);
    lines.push(`- Generator: automatic transfer, minimum 2-hour fuel supply at full load`);
    lines.push(`- Transfer switch: automatic, rated for emergency service`);
    lines.push(``);
    lines.push(`**NFPA 110 Level 2 (60-second restoration):**`);
    lines.push(`- Required for: HVAC for critical areas, security systems, data systems`);
    lines.push(`- UPS bridging: consider for critical loads during 10–60 s transfer time`);
  } else {
    lines.push(`Emergency lighting and exit signs per NBC 2020 Article 3.2.7 and CAN/ULC-S572.`);
    lines.push(`- Exit signs: self-luminous or battery-backed, 30-day test required`);
    lines.push(`- Emergency egress lighting: minimum 10 lux at floor level (NBC)`);
  }
  lines.push(``);

  // ─── Section 7: Lighting ──────────────────────────────────────────────────
  lines.push(`# Lighting Design`);
  lines.push(`**ASHRAE 90.1 Lighting Power Densities (LPD):**`);
  lines.push(`- Office: 9.7 W/m² · Retail: 12.9 W/m² · School classroom: 12.9 W/m²`);
  lines.push(`- Hospital patient room: 7.5 W/m² · Corridor: 5.4 W/m² · Parking garage: 2.2 W/m²`);
  lines.push(``);
  lines.push(`**Emergency / Exit Lighting (CAN/ULC-S572 + NBC 2020 Art. 3.2.7):**`);
  lines.push(`- Emergency lighting: minimum 10 lux at floor level on egress paths, stairs, exit doors`);
  lines.push(`- Self-contained units: minimum 30-minute battery duration; annual functional test required`);
  lines.push(`- Exit signs: internally illuminated, minimum 50 lux at face; visible from 30 m`);
  lines.push(`- Monthly: 30-second test; Annual: 30-minute test`);
  lines.push(``);
  lines.push(`**Lighting Control Checklist:**`);
  DESIGN_CHECKLIST.lightingSystem.forEach((item) => lines.push(`- [ ] ${item}`));
  lines.push(``);

  // ─── Section 8: Fire Alarm ────────────────────────────────────────────────
  lines.push(`# Fire Alarm System`);
  lines.push(`**Standards: CEC Section 32 + CAN/ULC-S524:2014 AMD1 + NFPA 72**`);
  lines.push(``);
  lines.push(`**CEC Section 32 — Wiring Requirements:**`);
  lines.push(`- Conductors: minimum No. 16 AWG (individual in raceway); No. 22 AWG (4+ conductor integral assembly)`);
  lines.push(`- Wiring method: ${CEC_SECTION_32.wiringMethod.permitted.join("; ")}`);
  lines.push(`- Independent routing: ${CEC_SECTION_32.wiringMethod.independence}`);
  lines.push(`- Power supply: ${CEC_SECTION_32.powerSupply.separateCircuit} — disconnect RED coloured and lockable ON`);
  lines.push(``);
  lines.push(`**CAN/ULC-S524 Power Supply Requirements:**`);
  lines.push(`- ${CANULC_S524.powerSupply.twoIndependent}`);
  lines.push(`- Battery only: ${CANULC_S524.powerSupply.emergencyPower.batteryOnly}`);
  lines.push(`- Battery + generator: ${CANULC_S524.powerSupply.emergencyPower.batteryPlusGenerator}`);
  lines.push(``);
  lines.push(`**CAN/ULC-S524 Wiring & Supervision:**`);
  lines.push(`- ${CANULC_S524.electricalSupervision.singleFaultRule}`);
  lines.push(`- Class A separation: ${CANULC_S524.electricalSupervision.classAWiring.separation}`);
  lines.push(`- Shielded cable: ${CANULC_S524.wiring.shieldedCable.continuity}`);
  lines.push(``);
  lines.push(`**Detector Mounting (CAN/ULC-S524 Cl. 8.2.3):**`);
  lines.push(`- ${CANULC_S524.detectors.mounting.preferred}`);
  lines.push(`- ${CANULC_S524.detectors.mounting.wall}`);
  lines.push(`- Elevator shaft: ${CANULC_S524.detectors.elevatorShafts.topOfShaft}`);
  lines.push(`- ${CANULC_S524.detectors.galleryMezzanine}`);
  lines.push(``);
  lines.push(`**Fire Alarm Design Checklist:**`);
  DESIGN_CHECKLIST.fireAlarm.forEach((item) => lines.push(`- [ ] ${item}`));
  lines.push(``);

  // ─── Section 9: Fire Pump ─────────────────────────────────────────────────
  if (["hospital", "airport", "arena", "industrial", "data_center", "government", "residential_highrise", "hotel"].includes(buildingType)) {
    lines.push(`# Fire Pump`);
    lines.push(`**Standards: CEC Rule 32-300 series + NFPA 20**`);
    lines.push(``);
    lines.push(`- Conductor ampacity: ${CEC_SECTION_32.firePump.conductors.ampacity}`);
    lines.push(`- Fire exposure protection: ${CEC_SECTION_32.firePump.conductors.fireExposure}`);
    lines.push(`- Wiring method: ${CEC_SECTION_32.firePump.wiringMethod.required}`);
    lines.push(`- Disconnect: ${CEC_SECTION_32.firePump.disconnecting.prohibition}`);
    lines.push(`- Disconnect lockable in CLOSED position; overcurrent rated for locked rotor current indefinitely`);
    lines.push(`- Transfer switch: ${CEC_SECTION_32.firePump.transferSwitch.dedicated}`);
    lines.push(`- Controller: Listed fire pump controller per NFPA 20 and CEC Rule 32-300 series`);
    lines.push(``);
  }

  // ─── Section 10: Special Systems ─────────────────────────────────────────
  lines.push(`# Special Systems`);
  lines.push(`**CEC Section 46 — Emergency Power, Life Safety Systems**`);
  lines.push(`- Capacity: ${CEC_SECTION_46.capacity}`);
  lines.push(`- Testing (CEC Rule ${CEC_SECTION_46.testing.rule}): ${CEC_SECTION_46.testing.monthlyTest}`);
  lines.push(`- ${CEC_SECTION_46.lampArrangement}`);
  lines.push(`- Wiring: ${CEC_SECTION_46.wiringMethod.required.join("; ")}`);
  lines.push(`- ${CEC_SECTION_46.wiringMethod.independence}`);
  lines.push(``);

  if (bspec) {
    lines.push(`**${bt} — Facility-Specific Electrical Requirements:**`);
    Object.entries(bspec).forEach(([category, items]) => {
      lines.push(`*${category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:*`);
      if (Array.isArray(items)) {
        (items as string[]).forEach((item: string) => lines.push(`- ${item}`));
      }
    });
    lines.push(``);
  }

  lines.push(`**Communications & Security Checklist:**`);
  DESIGN_CHECKLIST.communications.forEach((item) => lines.push(`- [ ] ${item}`));
  DESIGN_CHECKLIST.security.forEach((item) => lines.push(`- [ ] ${item}`));
  lines.push(``);

  // ─── Section 11: Electrical Room Design ──────────────────────────────────
  lines.push(`# Electrical Room Design`);
  lines.push(`**Working Clearance (CEC Rule 2-308):**`);
  lines.push(`- < 1,200 A and < 750 V: ${CEC_SECTION_6.workingSpace.lessThan1200AorLessThan750V}`);
  lines.push(`- ≥ 1,200 A or ≥ 750 V: ${CEC_SECTION_6.workingSpace.greaterOrEqualTo1200AorGreaterOrEqualTo750V}`);
  lines.push(`- Draw-out equipment: ${CEC_SECTION_6.workingSpace.drawoutEquipment}`);
  lines.push(``);
  lines.push(`**NBC 2020 — Life Safety & Fire Alarm:**`);
  lines.push(`- ${NBC_2020.fireAlarm.requirement}`);
  lines.push(`- ${NBC_2020.emergencyLighting.averageIllumination}`);
  lines.push(`- Emergency lighting duration: ${NBC_2020.emergencyLighting.duration}`);
  lines.push(``);
  lines.push(`**Electrical Room Design Checklist:**`);
  DESIGN_CHECKLIST.electricalRoom.forEach((item) => lines.push(`- [ ] ${item}`));
  lines.push(``);

  // ─── Section 12: Permit & Inspection Checklist ────────────────────────────
  lines.push(`# Permit & Inspection Checklist`);
  lines.push(`**Pre-Construction:**`);
  lines.push(`- [ ] Electrical permit application to AHJ (${pv ? PROV_NAMES[province] : "provincial"} jurisdiction)`);
  lines.push(`- [ ] Utility interconnection application (${pv ? pv.utility : "local utility"}) — submit single-line and load schedule`);
  lines.push(`- [ ] Arc flash hazard study (IEEE 1584 / CSA Z462) — required for service ≥ 208 V`);
  lines.push(`- [ ] Fire alarm drawing submission to local fire department / AHJ`);
  lines.push(`- [ ] Environmental / fuel storage permits for emergency generator`);
  lines.push(``);
  lines.push(`**At Rough-In:**`);
  lines.push(`- [ ] Conduit routing and support inspection`);
  lines.push(`- [ ] Grounding and bonding continuity test`);
  lines.push(`- [ ] Underground duct bank inspection before backfill`);
  lines.push(``);
  lines.push(`**At Energization:**`);
  lines.push(`- [ ] Megger insulation resistance test — all feeders and branch circuits`);
  lines.push(`- [ ] Ground fault test — service entrance`);
  lines.push(`- [ ] Fire alarm verification testing per CAN/ULC-S537`);
  lines.push(`- [ ] Emergency lighting 30-minute duration test`);
  lines.push(`- [ ] Transfer switch transfer time test`);
  lines.push(`- [ ] Generator load test — minimum 2 hours at full rated load`);
  lines.push(``);
  lines.push(`**Submittals / As-Built Documentation:**`);
  lines.push(`- [ ] Arc flash study report and PPE labels installed`);
  lines.push(`- [ ] Panelboard schedules and single-line diagram — as-built`);
  lines.push(`- [ ] Fire alarm certificate of verification (CAN/ULC-S537)`);
  lines.push(`- [ ] Generator service contract and fuel log setup`);
  lines.push(`- [ ] Spare parts list per specifications`);
  lines.push(``);

  // ─── Section 13: Design Notes ─────────────────────────────────────────────
  lines.push(`# Design Notes`);
  lines.push(`**General Checklist — Power Distribution:**`);
  DESIGN_CHECKLIST.powerDistribution.forEach((item) => lines.push(`- [ ] ${item}`));
  lines.push(``);
  lines.push(`**Mechanical / HVAC Coordination:**`);
  DESIGN_CHECKLIST.mechanicalEquipment.forEach((item) => lines.push(`- [ ] ${item}`));
  lines.push(``);
  if (false) {
    // placeholder — healthCare checklist is part of BUILDING_SPECIFIC for hospital
    lines.push(``);
  }
  lines.push(`---`);
  lines.push(`*Generated by ElectricGPT from reference documents: CEC CSA C22.1:24 · CSA C282-2015 · CAN/ULC-S524:2014 · NBC 2020 · Electrical Design Checklist (March 2026). For professional reference only — always verify with your licensed engineer and local AHJ.*`);

  return lines.join("\n");
}

// ─── Lookup maps ──────────────────────────────────────────────────────────────

const BUILDING_TYPES_MAP: Record<string, string> = {
  hospital: "Hospital / Healthcare Facility",
  school: "School / Educational Institution",
  airport: "Airport / Transportation Hub",
  data_center: "Data Center / Server Farm",
  office: "Commercial Office Building",
  industrial: "Industrial / Manufacturing Plant",
  residential_highrise: "Residential High-Rise / Condo",
  retail: "Retail / Shopping Centre",
  arena: "Arena / Sports & Entertainment Venue",
  hotel: "Hotel / Hospitality",
  museum: "Museum / Cultural Centre",
  parking: "Parking Structure / Garage",
  wastewater: "Wastewater / Water Treatment Plant",
  transit: "Transit Station / LRT / Metro",
  government: "Government / Civic Building",
  laboratory: "Research Laboratory / University",
};

const PROV_NAMES: Record<string, string> = {
  AB: "Alberta", BC: "British Columbia", MB: "Manitoba", NB: "New Brunswick",
  NL: "Newfoundland and Labrador", NS: "Nova Scotia", NT: "Northwest Territories",
  NU: "Nunavut", ON: "Ontario", PE: "Prince Edward Island", QC: "Quebec",
  SK: "Saskatchewan", YT: "Yukon",
};

const SCALE_MAP: Record<string, string> = {
  small: "Small (< 500 m²)",
  medium: "Medium (500 – 5,000 m²)",
  large: "Large (5,000 – 50,000 m²)",
  campus: "Campus-Scale (> 50,000 m²)",
};

const VOLTAGE_MAP: Record<string, string> = {
  "120_240": "120/240 V Single-Phase",
  "120_208": "120/208 V Three-Phase",
  "347_600": "347/600 V Three-Phase (Standard Canada)",
  "4160": "4,160 V Medium Voltage",
  "13800": "13,800 V Medium Voltage",
  "25000": "25,000 V High Voltage",
};
