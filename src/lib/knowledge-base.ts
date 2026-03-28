/**
 * ElectricGPT Knowledge Base
 * Built from reference documents:
 *  - 2024 Canadian Electrical Code (CEC) CSA C22.1:24
 *  - National Building Code of Canada 2020 (NBC)
 *  - C282-2015 Emergency Electrical Power Supply for Buildings
 *  - CAN/ULC-S524:2014 AMD1 Standard for Installation of Fire Alarm Systems
 *  - CANULC-S572 Emergency Lighting
 *  - Electrical Design Checklist (March 2026)
 *  - Voltage Drop Chart & Templates
 */

// ─── CEC Section 8 – Load Calculations ───────────────────────────────────────

export const CEC_SECTION_8 = {
  title: "CEC Section 8 — Circuit Loading and Demand Factors (CSA C22.1:24)",
  voltageDropLimits: {
    feederOrBranch: "3% maximum (CEC Rule 8-102 1)a)",
    totalServiceToLoad: "5% maximum from supply side of consumer's service to point of utilization (CEC Rule 8-102 1)b)",
    basis: "Connected load if known; otherwise 80% of overcurrent device rating (CEC Rule 8-102 1)",
  },
  continuousLoadRule: {
    rule: "CEC Rule 8-104 3)",
    definition: "A load persisting >1 h in any 2 h period (≤225 A) or >3 h in any 6 h period (>225 A) is continuous",
    sizing80pct: "Continuous load ≤ 80% of overcurrent device rating (or 70% for single conductors) where device is marked at 80% (CEC Rule 8-104 6)",
    sizing100pct: "Continuous load ≤ 100% of ampacity (or 85% for single conductors) where device is marked at 100% (CEC Rule 8-104 5)",
  },
  maxOutletsPerCircuit: {
    rule: "CEC Rule 8-304",
    entries: [
      "15 A @ 80% continuous rating → max 12 outlets",
      "15 A @ 100% continuous rating → max 15 outlets",
      "20 A @ 80% continuous rating → max 16 outlets",
      "20 A @ 100% continuous rating → max 20 outlets",
    ],
  },
  buildingLoads: {
    singleDwelling: {
      rule: "CEC Rule 8-200",
      basic: "5,000 W first 90 m² + 1,000 W each additional 90 m² (or portion)",
      alternate: "24,000 W (floor ≥ 80 m²) or 14,400 W (floor < 80 m²) — take greater of two methods",
    },
    apartment: {
      rule: "CEC Rule 8-202",
      notes: "Demand factors applied per Table in Rule 8-202",
    },
    school: {
      rule: "CEC Rule 8-204",
      basic: "50 W/m² classroom area + 10 W/m² remaining building area (outside dimensions)",
      plus: "Electric space-heating, A/C, and permanently connected equipment at full rating; EVSE at 100%; cord-connected receptacles >125 V or >20 A at 80% of receptacle rating",
      demandFactors: {
        upTo900m2: "75% of load balance after space-heating (CEC Rule 8-204 2)a)",
        over900m2: "75% × first 900 m² load/m² + 50% × balance (CEC Rule 8-204 2)b)",
      },
    },
    hospital: {
      rule: "CEC Rule 8-206",
      basic: "20 W/m² general building area (outside dimensions)",
      highIntensity: "100 W/m² for high-intensity areas such as operating rooms",
      plus: "Electric space-heating, A/C, and permanently connected equipment at full rating; EVSE at 100%; cord-connected >125 V or >20 A at 80% rating",
      demandFactors: {
        upTo900m2: "80% of load balance after space-heating (CEC Rule 8-206 2)a)",
        over900m2: "80% × first 900 m² + 65% × balance (CEC Rule 8-206 2)b)",
      },
    },
    hotelMotelDormitory: {
      rule: "CEC Rule 8-208",
      basic: "20 W/m² building area (outside dimensions)",
      plus: "Special area lighting (ballrooms, etc.) at full rating; space-heating, A/C, permanently connected equipment; EVSE at 100%",
      demandFactors: {
        upTo900m2: "80% of load balance after space-heating",
        over900m2: "80% × first 900 m² + 65% × balance",
      },
    },
    otherOccupancies: {
      rule: "CEC Rule 8-210",
      note: "Refer to CEC Table 14 for W/m² and demand factors by occupancy type (office, retail, industrial, etc.)",
      exitAndEmergency: "Where exit signs or emergency lighting cover the entire building, use connected load of circuits (CEC Rule 8-212 1)",
    },
  },
};

// ─── CEC Section 6 – Services ─────────────────────────────────────────────────

export const CEC_SECTION_6 = {
  title: "CEC Section 6 — Services and Service Equipment",
  disconnectLocation: "Service disconnect: 5.0 m maximum from entrance to facility (Design Checklist)",
  meterLocation: {
    maxFromCT: "9.0 m maximum from CT cabinet",
    mountHeight: "1.5 m to 1.7 m above finished floor",
    ctRequired: "CT cabinet required for services over 200 A (CEC Rule 6-400)",
    rule: "CEC Rule 6-408",
  },
  serviceEquipment: {
    rule6206: "Location of consumer's service equipment (CEC Rule 6-206)",
    undergroundConductors: "Underground conductors derated per Table D11 (×0.886 for conduit bundling — Design Checklist)",
    conductorMaterial: "Indicate CU or AL on drawings (Design Checklist)",
    allEquipment75C: "Note: all equipment rated for 75°C (Design Checklist)",
  },
  workingSpace: {
    rule: "CEC Rule 2-308",
    lessThan1200AorLessThan750V: "1.0 m minimum working clearance",
    greaterOrEqualTo1200AorGreaterOrEqualTo750V: "1.5 m minimum unless second egress path provided",
    drawoutEquipment: "Add draw-out dimension to clearance (e.g., 0.5 m draw-out + 1.0 m = 1.5 m total)",
  },
};

// ─── CEC Section 10 – Grounding & Bonding ────────────────────────────────────

export const CEC_SECTION_10 = {
  title: "CEC Section 10 — Grounding and Bonding",
  objective: "Minimize shock risk by establishing equipotentiality; facilitate protective device operation; stabilize system voltage (CEC Rule 10-002)",
  groundingElectrodes: {
    rule: "CEC Rule 10-102",
    rodElectrode: "Two rod electrodes spaced minimum 3 m apart, driven to full length, interconnected with grounding conductor",
    types: "Manufactured, field-assembled, or in-situ (existing infrastructure)",
  },
  padmountTransformer: {
    groundGrid: "1.0 m ground grid to pad (Design Checklist)",
    toBuilding: "1.0 m ground grid to building — must be non-metallic surfaces",
    metallicSurfaces: "2.0 m from ground grid to building or metallic surfaces",
    blastWall: "Blast wall / current-limiting fuses required where specified",
    setback: "Padmount transformer 6 m from building — standard (NB Power 3.2.2; verify local utility requirements)",
  },
  noObjCurrent: "No objectionable passage of current over a grounding conductor (CEC Rule 10-100)",
};

// ─── CEC Section 32 – Fire Alarm & Fire Pumps ────────────────────────────────

export const CEC_SECTION_32 = {
  title: "CEC Section 32 — Fire Alarm Systems and Fire Pumps",
  conductors: {
    rule: "CEC Rule 32-100",
    material: "Copper conductors with ampacity adequate for maximum circuit current",
    minimumSizes: [
      "No. 16 AWG for individual conductors pulled into raceways",
      "No. 19 AWG for individual conductors laid in raceways",
      "No. 19 AWG for integral assembly of 2+ conductors",
      "No. 22 AWG for integral assembly of 4+ conductors",
    ],
    insulation: "Minimum 300 V insulation rating; stranded >7 strands shall be bunch-tinned or compression terminated",
    fiberOptic: "Optical fibre permitted for data links between control units and transponders (CAN/ULC-S524 referenced)",
  },
  wiringMethod: {
    rule: "CEC Rule 32-102",
    permitted: [
      "Metal raceway — totally enclosed type",
      "Cable with metal armour or sheath",
      "Rigid non-metallic conduit",
      "ENT embedded in ≥50 mm masonry or poured concrete",
    ],
    combustibleConstruction: "Non-metallic sheathed cable, fire alarm & signal cable, or totally enclosed NMC raceway permitted",
    independence: "Entirely independent of all other wiring; shall not share raceways except at point of supply, signal, ancillary device, or communication circuit",
  },
  powerSupply: {
    rule: "CEC Rule 32-108",
    separateCircuit: "Power supply to fire alarm system shall be provided by a separate circuit",
    identification: "Overcurrent device and disconnecting means clearly identified as fire alarm power supply in permanent, conspicuous, legible manner",
    colour: "Disconnecting means coloured RED and lockable in the ON position",
  },
  firePump: {
    conductors: {
      rule: "CEC Rule 32-300",
      ampacity: "125% of full-load current rating of motor (single pump); 125% of sum of all FLC (multiple motors including jockey pump + auxiliary loads)",
      fireExposure: "Protected against fire exposure for continued operation per NBC",
    },
    wiringMethod: {
      rule: "CEC Rule 32-302",
      required: "Metal raceway (totally enclosed), armoured/metal-sheathed cable, rigid NMC in ≥50 mm concrete/masonry, or ENT in ≥50 mm concrete",
    },
    disconnecting: {
      rule: "CEC Rule 32-306",
      prohibition: "No device capable of interrupting the fire pump circuit except a circuit breaker labeled as the fire pump disconnecting means",
      lockable: "Circuit breaker lockable in CLOSED position",
      overcurrentRating: "Set or rated to carry indefinitely the locked rotor current of the fire pump",
    },
    transferSwitch: {
      rule: "CEC Rule 32-308",
      dedicated: "Transfer switch shall be provided solely for the fire pump",
      location: "In barriered compartment of fire pump controller, or separate adjacent enclosure",
      marking: "Labeled as fire pump power transfer switch in conspicuous, legible, permanent manner",
      onePerPump: "Separate transfer switch for each fire pump",
    },
    noGFP: "Ground fault protection shall NOT be installed in a fire pump circuit (CEC Rule 32-312)",
    noOverload: "Fire pump conductors/equipment need not require overload protection — protected by motor branch circuit overcurrent device (CEC Rule 32-310)",
  },
};

// ─── CEC Section 46 – Emergency Power ────────────────────────────────────────

export const CEC_SECTION_46 = {
  title: "CEC Section 46 — Emergency Power Supply, Unit Equipment, Exit Signs, and Life Safety Systems",
  scope: "Applies to emergency power supply and unit equipment for life safety systems and exit signs required by the NBC when normal supply fails (CEC Rule 46-000)",
  definitions: {
    emergencyPowerSupply: "Power from generator, batteries, or combination, required by NBC",
    lifeSafetySystems: "Emergency lighting, fire alarm systems, fire pumps, elevators, smoke-venting fans, smoke control fans and dampers required to have emergency generator per NBC",
    unitEquipment: "Emergency lighting unit equipment per CSA C22.2 No. 141",
  },
  capacity: "Emergency power supply and unit equipment shall have adequate capacity to maintain all connected equipment when normal power fails (CEC Rule 46-100)",
  testing: {
    rule: "CEC Rule 46-102",
    posting: "Complete operating instructions posted on-site in frame under glass; specify monthly testing requirement",
    monthlyTest: "Tested at least once every month to ensure security of operation",
  },
  batteryMaintenance: "Batteries kept in proper condition and fully charged at all times (CEC Rule 46-104)",
  lampArrangement: "No single lamp failure shall leave any area in total darkness; no non-emergency loads on emergency circuits (CEC Rule 46-106)",
  wiringMethod: {
    rule: "CEC Rule 46-108",
    required: [
      "Metal raceway — totally enclosed type",
      "Cable with metal armour or sheath (e.g., MI cable)",
      "Rigid non-metallic conduit",
      "ENT embedded in ≥50 mm masonry or poured concrete",
    ],
    independence: "Life safety conductors kept entirely independent of all other conductors and equipment",
    miCable: "Life safety luminaires require MI to first junction when crossing a storey (Design Checklist)",
    combust: "In combustible construction: NMC cable or totally enclosed NMC raceway permitted",
  },
  emergencyPowerSupply: {
    types: {
      rule: "CEC Rule 46-202",
      battery: "Storage battery (rechargeable) at ≥91% of full voltage for full duration (NBC minimum — but not less than 30 min); automatic charging means required",
      generator: "Generator: sufficient capacity, automatic start on transfer switch failure, conforming to CSA C282",
      autoBatteryProhibited: "Automobile batteries and non-enclosed lead batteries not permitted without deviation (Rule 2-030)",
    },
    fireExposure: "All power, control, and communication conductors between generator and life safety equipment outside generator room shall be protected against fire exposure (CEC Rule 46-204)",
    automaticTransfer: {
      rule: "CEC Rule 46-206",
      automatic: "Controlled by automatic transfer equipment activated on normal supply failure; accessible only to authorized persons",
    },
    overcurrentProtection: {
      rule: "CEC Rule 46-208",
      selective: "Overcurrent device at emergency power supply coordinated with downstream devices for selective operation",
      accessControl: "Branch circuit overcurrent devices accessible only to authorized persons",
    },
    troubleSignals: {
      rule: "CEC Rule 46-210",
      required: "Every emergency power supply must have audible AND visual trouble-signal devices",
      silencing: "Audible signals may be silenced; red warning light continues; auto or manual reset",
    },
  },
  unitEquipment: {
    mounting: "Bottom of enclosure ≥ 2 m above floor wherever practicable (CEC Rule 46-302)",
    receptacle: "Receptacle ≥ 2.5 m above floor; ≤ 1.5 m from unit equipment (CEC Rule 46-304 1)",
    permanentConnection: "Required if voltage rating >250 V or input rating >24 A (CEC Rule 46-304 2)",
    automatic: "Must actuate automatically on failure of normal lighting in the area (CEC Rule 46-304 4)",
  },
};

// ─── CSA C282-2015 – Emergency Electrical Power Supply ───────────────────────

export const CSA_C282 = {
  title: "CSA C282-2015 — Emergency Electrical Power Supply for Buildings",
  scope: "Applies to design, installation, operation, maintenance, and testing of emergency generators required by NBC or for health care facility essential electrical systems (CSA Z32) (Clause 1.1)",
  exclusions: "Does not cover UPS/battery systems or unit equipment per CSA C22.2 No. 141 (Clause 1.2)",
  generatorPlantRequirements: {
    location: {
      clause: "C282 Clause 6.2",
      notes: [
        "Located to minimize risk from flooding, fire, explosion, and vandalism",
        "Generator setback 1.5 m from property line minimum (Design Checklist)",
        "Generator setback 1.5 m from building minimum (Design Checklist)",
        "Confirm sub-base fuel tank quantity for special clearances (Design Checklist)",
        "Load center within genset for accessory power (Design Checklist)",
      ],
    },
    clearances: {
      clause: "C282 Clause 6.5",
      working: "Minimum clearances around generator set for maintenance access",
      multiple: "Where multiple generator sets installed, individual protection from single-event failure required",
    },
    ventilation: {
      clause: "C282 Clause 6.7",
      required: "Adequate ventilation for combustion air and cooling; coordinate heat loss with mechanical",
    },
    controlSequence: {
      clause: "C282 Clause 6.12",
      notes: "Pre-transfer elevator control sequence per Clause 6.14; load testing provisions per Clause 6.15",
    },
    emergencyLighting: "C282 Clause 6.11: Emergency lighting requirements; 2-hour rated emergency lighting fed from TVSS (Design Checklist)",
    loadTestingProvisions: "Provisions for load testing required (C282 Clause 6.15)",
  },
  generatorSizing: {
    clause: "C282 Clause 7",
    brakePower: "Generator set rated at site conditions after derating for altitude, temperature, and humidity (Clause 7.1)",
    derating: "Standard reference conditions: 100 m elevation, 25°C intake air, 30% relative humidity; derate for actual site conditions",
    exhaustRequirements: "Exhaust emissions compliance; routing to avoid re-ingestion (Clause 7.2)",
    fuelSupply: {
      minimumQuantity: "Minimum on-site fuel quantity per Clause 7.3.1; health care facilities per Clause 7.3.2",
      healthCareFacilities: "HCF: minimum fuel for 24 h full-load operation without resupply (C282 Clause 7.3.2)",
      nonHCF: "Non-HCF buildings: minimum fuel for operation as required by NBC",
      fuelQuality: "Fuel quality per Clause 7.3.5; visual clear-and-bright test required (Clause 11.5.5)",
      onSiteStorage: "On-site fuel storage tanks comply with Clause 7.3.8 and applicable fire codes",
      protectionOfLines: "Fuel supply lines protected against fire, mechanical damage, and flooding (Clause 7.3.11)",
    },
    controlPanel: "Automatic voltage regulator, overcurrent protection, status indicators required (Clause 7.4)",
    crankingCycle: "Cranking cycle requirements; generator must start automatically per Clause 7.5",
    startingPower: {
      batteries: "Storage batteries per Clause 7.6.1 — capacity and maintenance requirements",
      compressedAir: "Compressed air starting permitted per Clause 7.6.2",
    },
  },
  transferSwitches: {
    clause: "C282 Clause 9",
    phaseRotation: "Phase rotation must be verified (Clause 9.2)",
    electricalCharacteristics: "Rated for service (Clause 9.3)",
    automaticTransfer: {
      clause: "C282 Clause 9.4",
      timing: "Generator must start and assume load within time required by NBC (typically 10 s for life safety)",
      atsForHCF: "ATS provided solely for each life safety system in health care facilities",
    },
    manualBypass: "Manual bypass switch required (Clause 9.5)",
  },
  initialTesting: {
    clause: "C282 Clause 10",
    operationalTest: "Full operational test per Clause 10.2",
    maximumLoadTest: "Test at maximum site design load per Clause 10.3; load type and power factor per Clause 10.3.2",
    crankTest: "Cycle crank test per Clause 10.4",
    safetyShutdowns: "Safety shutdown and alarms tested per Clause 10.5",
    ventilationTest: "Ventilation verified during load test (Clause 10.6)",
    operatorTraining: "Operator training required before handover (Clause 10.7)",
    oilAnalysis: "Oil analysis after initial load test (Clause 10.8)",
  },
  maintenanceProgram: {
    clause: "C282 Clause 11",
    annualTest: "Annual test at full rated load for minimum 4 h (Clause 11.3)",
    periodicTests: "Periodic operational tests (monthly no-load run minimum 30 min) per Clause 11.4",
    maintenanceLog: "Maintenance logbook (C282 Logbook-15) kept on-site (Clause 11.1.2)",
    visualFuelInspection: "Clear-and-bright fuel test per ASTM D4176 at each maintenance interval (Clause 11.5.5)",
  },
};

// ─── CAN/ULC-S524:2014 AMD1 – Fire Alarm System Installation ─────────────────

export const CANULC_S524 = {
  title: "CAN/ULC-S524:2014 AMD1 — Standard for Installation of Fire Alarm Systems",
  powerSupply: {
    clause: "S524 Clause 4.2",
    twoIndependent: "Two independent power supplies required: one primary, one emergency (Clause 4.2.1.1)",
    emergencyPower: {
      batteryOnly: "24 h standby + rated alarm load duration (Clause 4.2.3.3 A)",
      batteryPlusGenerator: "4 h standby + rated alarm load duration (Clause 4.2.3.3 B)",
      alarmDuration: "Alarm load duration as required by NBC (Clause 4.2.3.4)",
    },
    primaryFromEmergencyBus: "Distributed systems: primary power may come from essential emergency supply if fire alarm circuit has separate overcurrent protection identified per CEC Section 32; label required at main source (Clause 4.2.3.2)",
  },
  electricalSupervision: {
    clause: "S524 Clause 4.3",
    singleFaultRule: "Single fault on power buss shall not prevent normal operation in more than one NBC-required fire alarm zone (Clause 4.3.1.8)",
    classAWiring: {
      separation: "Class A: primary and alternate wiring in separate raceways with minimum 300 mm vertical separation or 1,200 mm horizontal separation (Clause 4.3.1.9)",
      exceptions: [
        "Single conduit ≤3,000 mm to control unit enclosures",
        "Single conduit drops to individual field devices",
        "Single conduit drops to multiple devices in one room ≤100 m²",
      ],
    },
    faultIsolators: "Class A circuit with fault isolators per Subsection 10.2 (Clause 4.3.1.13)",
  },
  wiring: {
    clause: "S524 Clause 4.4",
    shieldedCable: {
      continuity: "Shield continuous and isolated from ground through all junction boxes (Clause 4.4.11 A)",
      bonding: "Bonded per manufacturer's instructions (Clause 4.4.11 B)",
      independent: "Each cable assembly with separate shield — do not common-connect shields (Clause 4.4.11 C Note)",
    },
    dataLinks: "Shielded cable assemblies for data communication in same raceway shall each have separate shield (Clause 4.4.12)",
    ancillaryCircuits: "Ancillary circuits shall not activate circuits >30 V directly within control unit; use external relay (Clause 4.4.13)",
    exitingBuilding: "Non-current-carrying conductive components bonded per CEC Section 26 where cables leave building (Clause 4.4.10)",
  },
  detectors: {
    mounting: {
      clause: "S524 Clause 8.2.3",
      preferred: "Spot type detectors mounted on ceiling (Clause 8.2.3.1)",
      wall: "Wall mounting permitted: 100 mm to 300 mm below ceiling, measured to top edge of detector (Clause 8.2.3.2)",
    },
    elevatorShafts: {
      clause: "S524 Clause 8.3.14",
      topOfShaft: "Fire detector at highest point of shaft (Clause 8.3.14.1)",
      pitDetectors: "Heat detectors in pit: 100 mm to 300 mm below lowest point of car travel (Clause 8.3.14.2)",
      linearAlternative: "Linear heat detection cable around inside perimeter of shaft as alternative to spot type (Clause 8.3.14.3)",
    },
    galleryMezzanine: "Smoke detectors at gallery/mezzanine openings: within 300 mm of floor assembly opening, max 4.6 m spacing (Clause 8.3.4.3)",
  },
  notificationDevices: {
    audible: "Audible signal devices within building shall generate similar sounds and sound patterns (Clause 9.1.7)",
    strobes: {
      clause: "S524 Clause 9.4",
      minimumIntensity: "Minimum 15 candela effective luminous intensity (Clause 9.4.1)",
      sleepingRooms: {
        lessThan610mmFromCeiling: "Minimum 177 cd where device is <610 mm from ceiling (Clause 9.4.19)",
        otherLocations: "Minimum 110 cd for all other locations in sleeping rooms (Clause 9.4.19)",
        placement: "Locate within 4.87 m of pillow (Note to Clause 9.4.19)",
      },
    },
  },
  largScaleNetworks: {
    clause: "S524 Clause 5.8",
    threshold: "LSN required where: >1,000 total active field devices + detectors; or building within NBC Subsection 3.2.6 (high-rise) (Clause 5.8.1)",
    controlUnitLocation: "Each control unit/transponder in suitable service room separated from building by minimum 1 h fire separation (Clause 5.8.8)",
    voiceAlarm: "Buildings requiring voice communications per NBC shall have at least one redundant control unit/transponder with annunciation, voice transmission, and All-Call (Clause 5.8.6)",
    standAloneMode: "Each control unit/transponder shall have stand-alone capability (Clause 5.8.5)",
  },
  faultIsolators: {
    dataFaultIsolators: "Required per Clause 10.2.1 for Class B loops; not required between devices on same floor area (Clause 10.2.1.3)",
    powerBussFaultIsolators: "Required for power busses serving multiple NBC-required fire alarm zones (Clause 10.2.4.1)",
    suiteFaultIsolators: "Option for meeting NBC requirements for notification in residential/care occupancies (Clause 10.2.6.1)",
  },
  fireSuppression: {
    clause: "S524 Clause 12",
    supervision: "Each releasing device/circuit for suppression system shall be electrically supervised (Clause 12.1.2)",
    alarmInitiation: "Alarm initiating and supervisory devices installed per Clause 12.3",
  },
};

// ─── NBC 2020 – Electrical / Life Safety Requirements ────────────────────────

export const NBC_2020 = {
  title: "National Building Code of Canada 2020 (NBC 2020)",
  fireAlarm: {
    article: "NBC Article 3.2.4 and Division B",
    requirement: "Fire alarm system required in buildings not sprinklered throughout with occupant load >25 (Group G, Div 1) or >150 (Group G, Div 2/3), or >1 storey, or basement use other than service equipment",
    system: "Must comply with CAN/ULC-S524 (Standard for Installation of Fire Alarm Systems)",
    twoStage: "Two-stage system required in many occupancies; single-stage permitted for Group G, Div 1",
    alarmSignals: "Audible signal devices min 110 dBA exterior for farm; visible devices where ambient >87 dBA or ear protection in use",
    silencing: "Alarm signal cannot be silenced automatically before 20 min minimum",
  },
  emergencyLighting: {
    article: "NBC Article 3.2.7 and Section 2.2.5",
    averageIllumination: "Minimum 10 lx average at floor/tread level in exits and principal egress routes (NBC 2.2.5.1 1)",
    minimumIllumination: "Absolute minimum 1 lx anywhere",
    duration: "Emergency power supply (batteries or generator) must maintain emergency lighting for minimum 30 min upon normal power failure (NBC 2.2.5.1 3)b)",
    automatic: "Load assumed automatically upon failure of regular power supply",
  },
  exitSigns: {
    article: "NBC Article 3.4.5",
    requirement: "Required at every exit door and wherever egress direction is not obvious",
    power: "Emergency power supply required for exit signs",
  },
  highRise: {
    article: "NBC Subsection 3.2.6",
    definition: "Building height >36 m (generally, refer to NBC for precise definition)",
    requirements: [
      "Two-stage fire alarm system with voice communication",
      "Emergency power for elevators (at least one elevator)",
      "Smoke control systems",
      "Pressurized stairwells",
    ],
  },
  occupancyClassifications: {
    A: "Assembly occupancy (theatres, places of worship, arenas, restaurants)",
    B: "Care or detention occupancy (hospitals, nursing homes, prisons)",
    C: "Residential occupancy (apartments, hotels)",
    D: "Business and personal services (offices)",
    E: "Mercantile occupancy (retail stores)",
    F: "Industrial occupancy (factories, warehouses)",
  },
};

// ─── Building-Type Specific Requirements ─────────────────────────────────────

export const BUILDING_SPECIFIC = {
  hospital: {
    primaryStandard: "CSA Z32 — Electrical Safety and Essential Electrical Systems in Health Care Facilities",
    powerSystems: {
      essential: "Essential electrical system (EES) with three branches: life safety, critical, equipment (CSA Z32 Clause 6)",
      lifeSafetyBranch: "Connects to load within 10 s of power interruption; feeds fire alarm, egress lighting, exit signs, communications, life-safety equipment",
      criticalBranch: "Connects within 10 s; feeds task illumination in patient care areas, nursing stations, medication rooms, telephone systems",
      equipmentBranch: "May connect within 30–60 s; feeds HVAC, sterilizers, elevators, large equipment",
    },
    receptacles: {
      grade: "Hospital-grade receptacles required in patient care areas (CEC Section 24, Design Checklist)",
      phasing: "Patient care area circuit phasing — circuits at patient care area from different phases (Design Checklist)",
    },
    lighting: {
      cri: ">85 CRI lighting in patient care areas (Design Checklist)",
      cleanRooms: "Clean room lighting where required (Design Checklist)",
      orLighting: "5000K colour temperature in operating rooms and angiography suites",
    },
    wiring: {
      verticalConduit: "Vertical conduit in walls only — no horizontal conduit in patient areas (Design Checklist)",
      infectionControl: "Infection control coordinated — minimise penetrations and exposed surfaces",
    },
    powerSources: "Only one source of each level of power in patient care area; different level panels bonded together (Design Checklist)",
    generatorFuel: "24 h on-site fuel minimum (C282 Clause 7.3.2)",
    nurseCall: {
      mainStation: "Main station at manned desk (Design Checklist)",
      corridorDome: "Corridor dome lights maintain visibility from alcoves (Design Checklist)",
      zoneLights: "Zone lights for corridor indication (Design Checklist)",
    },
    Z32Reno: "Renovation: verify Z32 requires lighting to have partial essential and partial normal even if not in scope (Design Checklist)",
  },
  school: {
    loadCalc: "CEC Rule 8-204: 50 W/m² classroom + 10 W/m² remaining; demand factors apply",
    emergencyPower: "Emergency lighting required per NBC; generator or battery per building height and occupancy",
    fireAlarm: "Two-stage or single-stage system per NBC; manual pull stations at each exit; duct smoke detectors on multi-storey AHU",
    communications: "Voice data drops throughout; coordinate with IT for rack locations within 90 m of data drops (Design Checklist)",
    security: "Card access, CCTV, intercom systems common",
    lighting: "Lighting controls per province energy code (Title 24/ASHRAE 90.1 equivalent); switch height 1100 mm always",
  },
  airport: {
    power: "Dual utility feeds or on-site generation for critical systems; Category I/II/III instrument approach lighting",
    groundingBonding: "Lightning protection system required; surge protection at service entrance and distribution equipment",
    fireAlarm: "Large-scale network system (>1,000 devices) — S524 Subsection 5.8 applies; voice communication required per NBC 3.2.6",
    emergencyPower: "C282 Class B or Class A generator sets; full load test per C282 Clause 10.3; fuel for ≥24 h operation",
    landingSystems: "ILS critical areas — electromagnetic compatibility requirements for electrical installations",
    paging: "Public address and voice alarm integrated with fire alarm; separate PA amplifiers with UPS backup",
  },
  dataCenter: {
    power: "Dual normal utility feeds preferred; N+1 or 2N UPS architecture; generator backup with automatic transfer",
    cooling: "High-density cooling loads: coordinate electrical for CRAC, CRAH, and in-row cooling units",
    grounding: "Isolated ground (IG) receptacles for sensitive equipment; equipotential bonding plane",
    fireAlarm: "Very Early Smoke Detection Apparatus (VESDA) preferred; clean agent suppression systems wired per S524 Section 12",
    upsSizing: "UPS sized for IT load + 25% growth; battery autonomy typically 10–15 min; generator startup time critical",
    tier: "Design per Uptime Institute Tier Standard (Tier I–IV); Tier III = N+1 redundancy, concurrently maintainable",
  },
  office: {
    loadCalc: "CEC Rule 8-210 and Table 14; typical 25–40 W/m² for offices; data processing loads continuous per CEC Rule 8-302",
    lighting: "Energy-efficient lighting controls; daylight harvesting per province energy code",
    fireAlarm: "Single-stage or two-stage per NBC occupant load and building height; addressable system typical",
    power: "Dedicated circuits for computers/UPS; shared neutrals prohibited for data processing loads",
    communications: "Structured cabling per TIA-568; data drops within 90 m of IDF/MDF (Design Checklist)",
  },
  industrial: {
    hazardous: "Hazardous Location Plan (HLP) required; coordinate with all trades; Class/Division/Zone classification per CEC Section 18/20",
    hlp: "HLP must show Ocal from wet well to Class 1 Div 1 junction box; eyes fitting on building side of Class 1 Div 1 j-box (Design Checklist)",
    loadCalc: "CEC Rule 8-210 and Table 14; motor loads with applicable demand factors per CEC Rule 8-106",
    motorProtection: "Motor branch circuits per CEC Section 28; overload and overcurrent protection; combination starters or separate relay+manual starter for small loads",
    grounding: "Equipment grounding essential; hazardous location bonding requirements (CEC Section 18)",
    heatTrace: "Confirm controls for heat trace (Design Checklist)",
  },
  residentialHighrise: {
    loadCalc: "CEC Rule 8-202 for apartments; demand factors applied per Table in Rule 8-202",
    suiteFireAlarm: "Suite fault isolators per S524 Subsection 10.2.6 as option for NBC residential notification compliance",
    emergencyPower: "Generator for elevators (NBC high-rise requirements), fire pump, emergency lighting, smoke control",
    evCharging: "EVSE loads included at 100% demand (CEC Rule 8-202 1)a)vii)); EV energy management system per CEC Rule 8-500 may reduce demand",
    smokeAlarms: "Permanently connected smoke alarms on lighting or mixed lighting/receptacle circuit; not on GFCI or AFCI protected circuit unless integral battery secondary supply (CEC Rule 32-200)",
  },
  retail: {
    loadCalc: "CEC Rule 8-210 and Table 14; show window lighting minimum 650 W/m of window base (CEC Rule 8-212 2)",
    lighting: "Exterior signage requires disconnect (Design Checklist); exterior lighting controls for voltage drop consideration",
    fireAlarm: "Addressable system; duct smoke detectors on HVAC systems serving multiple zones",
    emergencyLighting: "Exit signs and emergency lighting per NBC; battery-backed unit equipment or centralized emergency lighting panel",
  },
  arena: {
    power: "High connected load: large HVAC (ice plant, dehumidification), lighting (sports lighting, video boards), catering equipment",
    scoreboard: "Large power feed to scoreboard/video boards; temporary power provisions for events",
    iceArena: "Ammonia refrigeration coordination; electrical in refrigeration room per CEC Section 18",
    fireAlarm: "Voice communication system; large-scale network if >1,000 devices; strobes throughout seating bowl",
    emergencyLighting: "High-ceiling emergency lighting with battery packs or remote heads; photometric calculation required",
  },
  hotel: {
    loadCalc: "CEC Rule 8-208: 20 W/m² + special areas + space-heating, A/C, permanently connected equipment",
    guestRooms: "GFCI receptacles in bathrooms; smoke alarms in each suite; CO alarms where applicable",
    fireAlarm: "Two-stage system typical; suite fault isolators per S524 for notification; voice alarm in common areas",
    sleepingRoomStrobes: "Minimum 177 cd (within 610 mm of ceiling) or 110 cd (other locations) in sleeping rooms (S524 Clause 9.4.19)",
    emergencyPower: "Generator for fire pump, elevators, emergency lighting, kitchen ventilation for large hotels",
    kitchenEquipment: "Large ovens >1,500 W direct connection do not need disconnect (CEC Rule 26-746); dishwasher lineups with control panel do require disconnect (Design Checklist)",
  },
  museum: {
    power: "Climate control (HVAC) is dominant load; lighting systems for collections (UV control, dimming)",
    specialLighting: "Fibre optic or LED with UV filtering for sensitive collections; emergency and egress lighting per NBC",
    security: "Comprehensive CCTV, access control, intrusion detection — all integrated systems",
    fireAlarm: "Smoke detection and clean agent suppression in collection areas; S524 Section 12 for suppression releasing",
    humidity: "Humidification and dehumidification electrical loads; coordination with mechanical",
  },
  parking: {
    lighting: "Min lighting levels per IES standards; LED preferred with dimming controls; CO/NO2 detection control of ventilation",
    evCharging: "Increasing EVSE loads; energy management system per CEC Rule 8-500 to manage demand",
    ventilation: "CO-triggered ventilation; motor starters and VFDs for supply and exhaust fans",
    fireAlarm: "Heat detectors (smoke detectors not suitable for open/semi-open parkades); PRE-SIGNAL if parking is not sprinklered",
    grounding: "Equipotential bonding for structural reinforcement and metallic infrastructure",
    heaters: "Vehicle block heater receptacles per CEC Rule 8-400; controlled or restricted mode as applicable",
  },
  wastewater: {
    hazardous: "Wet wells classified Class 1 Div 1 or 2 as applicable; Ocal seals required; eyes fittings per Design Checklist",
    processElectrical: "Motor control centres; VFDs for pumps; generator backup for critical pumping stations",
    fireAlarm: "Fire detection in control buildings; not typically required in wet well (hazardous area)",
    odourControl: "Electrical for odour control systems (biofilters, chemical dosing)",
    telemetry: "SCADA and telemetry power supply; communication systems for remote monitoring",
  },
  transit: {
    systemPower: "Traction power supply (separate from station power); station power for lighting, HVAC, fare equipment, escalators/elevators",
    emergencyPower: "UPS for fare collection, communications, SCADA; generator for life safety and critical ventilation",
    fireAlarm: "Large-scale network if multiple stations on one system; voice communication throughout; tunnel detection",
    publicAddress: "Integrated PA/voice alarm; audio clarity requirements in high-noise environments",
    escalatorsElevators: "CSA B44 (Elevators and Escalators) requirements; elevator electrical per CEC Rule 38 and B44",
    lighting: "Emergency egress lighting for tunnels per NBC; photometric design for platform and concourse areas",
  },
  government: {
    security: "High-security systems; access control; perimeter monitoring; classified areas may have shielded rooms",
    power: "Diesel generator backup; UPS for critical systems; often dual utility feeds",
    fireAlarm: "Standard NBC requirements; coordination with building operations centre",
    communications: "Government-grade structured cabling; often separate secure and non-secure networks",
    accessibility: "CSA B651-23 accessible design requirements for all systems",
  },
  laboratory: {
    power: "Clean power for sensitive instruments; isolated ground systems; UPS for critical research equipment",
    hazardous: "Fume hoods require dedicated exhaust; electrical in chemical storage areas per CEC hazardous location rules",
    grounding: "Equipotential bonding; static dissipation where required",
    fireAlarm: "VESDA in areas with high-value equipment; clean agent suppression for server/instrument rooms",
    emergencyPower: "Generator for -80°C freezers and incubators; critical research samples protection",
  },
};

// ─── Design Checklist (from Electrical Design Checklist March 2026) ───────────

export const DESIGN_CHECKLIST = {
  sitePlan: [
    "Overhead service routing (crane access, walkways, etc.) confirmed",
    "Underground service routing (ditches, swales, piping) confirmed",
    "Ground grid shown (location, cable, sizing, rods)",
    "Conduits for wells, tanks, lighting shown and coordinated",
    "Communications coordinated with utility",
    "Parking lot lighting coordinated (circuits, control, voltage drop)",
    "Service coordinated with single-line diagram and electrical room (cable/conduit type and size)",
    "Lightning protection assessed",
    "Note on existing services and locates",
    "Padmount transformer: 6 m from building — standard",
    "Padmount transformer: 1.0 m ground grid to pad; 1.0 m to building (non-metallic surfaces); 2.0 m to metallic surfaces",
  ],
  generator: [
    "C282 installation requirements confirmed",
    "2-hour rated emergency lighting fed from TVSS",
    "Generator setback: 1.5 m from property line",
    "Generator setback: 1.5 m from building",
    "Confirm fuel quantity in sub-base tank for special clearances",
    "Load center within genset for accessory power",
  ],
  powerDistribution: [
    "Single-line diagram complete (breaker, sizing, special requirements)",
    "Service entrance coordinated with utility",
    "Service entrance calculation per CEC",
    "Overhead or underground service specified",
    "Pole or padmount transformer (600 A special permission for pole-mounted)",
    "Transformer physical size requirements verified",
    "Interrupting rating confirmed (panels, ATS)",
    "Service conductor: CU or AL indicated",
    "Underground conductors per D11 (×0.886)",
    "All equipment rated for 75°C — note on drawings",
    "Service disconnect size and fuse type confirmed",
    "Ground grid and cable size confirmed",
    "CT cabinet requirements (over 200 A service)",
    "600 V service: meter located inside building",
    "Distribution panels: Main Lug vs. Main Breaker confirmed",
    "Panel room locations indicated on plan",
    "Cable and conduit sizing for panels confirmed",
    "Primary protection <125% for transformer",
    "Transformer named for sub-panel",
    "K-rated transformers required where non-linear loads present (200% neutral)",
    "NEMA ratings for equipment confirmed",
    "Free-air rating void when MI cable jacketed inside building — use Table 2 ampacity",
    "Controls for heat trace confirmed",
    "Kitchen appliances >1,500 W direct connection: verify disconnect requirement per CEC Rule 26-746",
  ],
  electricalRoom: [
    "Disconnect location: 5.0 m max from entrance to facility (CEC)",
    "Meter location: 9.0 m max from CT cabinet; mounted 1.5 m to 1.7 m high",
    "Working space <1,200 A or <750 V: 1.0 m minimum",
    "Working space ≥1,200 A or ≥750 V: 1.5 m unless second egress path",
    "Working space is additional to draw-out equipment dimension",
    "Backboard for electrical and communications equipment",
    "Room ventilation / transformer heat loss — coordinate with mechanical",
    "Equipment list reviewed: switchgear orientation L to R vs R to L confirmed",
    "All equipment drawn to scale (plan and section)",
    "Special elevations as required",
  ],
  panelSchedule: [
    "Panel naming convention: Voltage / Distribution / Type / Floor / Identifier (Design Checklist)",
    "Equipment loads entered",
    "Breaker sizes indicated",
    "Correct breaker quantity indicated",
    "Spare breakers indicated",
    "Shunt trip for elevator per CEC/NFPA",
    "Shunt trip for AHUs from duct detectors",
    "Shunt trip for kitchen equipment per NFPA",
    "Shunt trip adds additional pole to breaker",
    "Single-line diagram matches panel sheets confirmed",
  ],
  lightingSystem: [
    "Lighting model complete and reviewed within budget",
    "Lighting calculation for LEED or Green Globes completed",
    "Lighting fixtures coordinated with architect and reflected ceiling plan",
    "Colour temperature coordinated in existing facilities",
    "Lighting schedule complete and reviewed with lighting controls",
    "Lighting schedule coordinated with plan",
    "Switch location and identification confirmed",
    "Switch height: 1,100 mm always — never match existing if different",
    "Fixtures requiring special rating confirmed (outdoor, wet, vandal resistant)",
    "Lighting control panel schematic complete",
    "Sequence of operations document complete",
    "Exterior lighting complete; exterior controls account for voltage drop",
    "Fixture mounting heights confirmed (chains, pendants, exterior)",
    "Emergency light quantities determined (batteries vs. remote heads)",
    "Exit signage layout / egress direction confirmed",
    "Disconnect required for exterior signage",
    "Life safety luminaires: MI cable to first junction when crossing a storey",
  ],
  mechanicalEquipment: [
    "All equipment coordinated with mechanical department (disconnects where required)",
    "Circuits shown on panel schedule and equipment schedule",
    "Voltage, load, and phase coordinated",
    "Heater design and schedule complete",
    "Controls required (conduit and back box if required) / starters",
    "Combination mag starters physically large — specify relay and manual starter for small loads",
    "Power supplied to fire/smoke dampers: 120 V or 24 V (prefer 120 V); run MI if required",
  ],
  communications: [
    "Voice and data drops located on plan and coordinated with architect",
    "Data rack design/schematic complete and reviewed",
    "Rack cooling if required",
    "Data drops within 90 m of rack",
    "Data rack elevations complete",
    "Contractor or owner supplying data switches confirmed",
    "Method of installation: J-hook, conduit, or cable tray confirmed",
    "Coordinate with utility for external communications",
    "Fibre rack interconnections or copper confirmed",
    "Voice patch panel installed in rack",
    "Voice over IP required?",
    "Cable tray routing: draw corner radius per spec",
  ],
  fireAlarm: [
    "Fire alarm riser diagram complete",
    "Panel located; call-out requirements coordinated",
    "Devices placed to meet code requirements (S524 and NBC)",
    "Coordinated with mechanical equipment (sprinkler, dampers, kitchen, etc.)",
    "Isolators and EOLs used where required",
    "Voice requirements confirmed",
    "MI cabling required?",
    "Fire pump required?",
    "Maglock keyed reset shown",
    "Input modules and relay for fire/smoke dampers (detector always supplied by mechanical)",
    "Detector at top of elevator shaft and at each landing (even if sprinklered) — S524 Clause 8.3.14",
    "Fire alarm devices in cold/unheated locations cannot be addressable",
  ],
  security: [
    "Panel located; call-out requirements coordinated",
    "Door hardware confirmed with door hardware consultant",
    "Door access tied to security system",
    "Devices indicated on plans",
    "Dial-out provisions confirmed",
    "Maglocks release on fire alarm condition",
    "Devices supplied by contractor or raceway-only confirmed",
    "Door elevations coordinated with actual door requirements",
    "Interface with door operator for card access if needed",
    "Wave sensors: 4C#18 (2 power, 2 contact closure)",
  ],
  cctv: [
    "Camera within 90 m of rack",
    "Contractor or owner supplying data switches confirmed",
    "In common rack with data or voice",
    "UPS for adequate run time",
    "Coverage angle confirmed",
    "Workstation specification current",
    "Workstation location: rack-mounted or desk confirmed",
    "Software/commissioning requirements confirmed",
    "Exterior camera mounting detailed",
    "Exterior cameras: 120 V for power supply",
  ],
  elevators: [
    "4 × 2C#12 between ATS and elevator controller (pre-transfer and status)",
    "Lighting at top and bottom of shaft with switch",
    "GFCI receptacle in control room; top and bottom of shaft",
    "Two 15 A 120 V circuits for cab lighting and system communication device; local disconnect required",
    "Disconnect for elevator cab: closest to entry door latch side",
    "Smoke detector at top of shaft even if sprinklered (S524 Clause 8.3.14)",
    "Shunt trip on elevator circuit per NFPA requirements",
  ],
};

// ─── Voltage Drop Reference ───────────────────────────────────────────────────

export const VOLTAGE_DROP_REF = {
  cecLimits: {
    feederOrBranchCircuit: "3% maximum (CEC Rule 8-102 1)a)",
    totalServiceToLoad: "5% maximum from service supply to point of utilization (CEC Rule 8-102 1)b)",
  },
  basis: "Based on connected load if known; otherwise 80% of overcurrent device rating",
  formula: "VD = (√3 × I × L × R) / 1000 for 3-phase; VD = (2 × I × L × R) / 1000 for single-phase",
  where: "I = current (A), L = one-way length (m), R = conductor resistance (Ω/km from CEC Table 2 or Voltage Drop Chart)",
  conductorSizing: "Use CEC Table 2 for conductor ampacity; derate for temperature, bundling, and installation method",
  exteriorLighting: "Always check voltage drop for exterior lighting circuits — long runs are common (Design Checklist)",
  parkingLot: "Parking lot lighting: confirm circuits, control, and voltage drop (Design Checklist)",
};

// ─── Panel Naming Convention (from Design Checklist) ─────────────────────────

export const PANEL_NAMING = {
  convention: "Voltage / Distribution / Type / Floor / Identifier",
  voltage: { "2": "120/208 V", "4": "120/240 V or 240 V", "6": "347/600 V", "46": "480/277 V", "12": "Medium voltage 12 kV" },
  distribution: { N: "Normal", E: "Essential/Emergency", B: "Both (normal and emergency)" },
  type: { N: "Normal", E: "Emergency", B: "Both", V: "Vital", D: "Distribution", C: "Critical", U: "Uninterruptible" },
  floor: { "00": "Basement", "0": "Ground", "1": "1st floor", etc: "Sequential by floor" },
  identifier: "A, B, C, D, E — sequential identifier on each floor",
  example: "6DNA = 347/600 V, Normal distribution, Normal type, Ground floor, Identifier A",
};

// ─── Transformer Impedance Reference ─────────────────────────────────────────

export const TRANSFORMER_REF = {
  standardImpedances: "Refer to Transformer Impedances.xlsx (in Reference Documents)",
  primaryProtection: "Primary protection <125% of rated primary current (Design Checklist; CEC Rule 26-256)",
  kRated: "K-rated or mitigating transformers with 200% neutral required where non-linear loads (harmonics) are present (Design Checklist)",
  heatLoss: "Transformer heat loss must be coordinated with mechanical room ventilation (Design Checklist)",
  namingForSubPanel: "Transformer must be named for its associated sub-panel on single-line diagram (Design Checklist)",
  workingSpace: "Transformer working space per CEC Rule 2-312",
  impedance: "% impedance affects short-circuit current available at secondary — verify interrupting rating of downstream equipment",
};
