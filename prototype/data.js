// OGWAMA One — Realistic Ogun State Seed Data

window.OGWAMA_DATA = {
  departments: [
    {
      id: "all",
      label: "All Agency (MD / CEO)",
      bannerTitle: "Executive Command Overview — Ogun State Waste Management Authority",
      bannerText: "Real-time visibility across Industrial 60/40 split settlements, Residential/Estate 80/20 billing, 2027 online licensing, and statewide ward compliance — at ₦0 upfront capital cost to Ogun State.",
      highlightKpis: ["collections", "settled", "licenses", "capture"]
    },
    {
      id: "finance",
      label: "Finance & Accounts",
      bannerTitle: "Finance & Accounts Lens — Pre-Split Treasury Reconciliation",
      bannerText: "Every industrial/commercial invoice settles simultaneously via pre-authorized gateway splits (40% OGWAMA Treasury / 60% PSP) — eliminating manual claim letters and treasury approval delays.",
      highlightKpis: ["collections", "settled"]
    },
    {
      id: "commercial",
      label: "Commercial Dept",
      bannerTitle: "Commercial Services Lens — Industrial Capture & Estate Bulk Billing",
      bannerText: "Track uncaptured factories, plazas, and organised estates; verify Commercial Officer enumeration targets and enforce direct digital billing across Ogun corridors.",
      highlightKpis: ["collections", "capture"]
    },
    {
      id: "operations",
      label: "Operations Dept",
      bannerTitle: "Operations Lens — PSP Fleet, Non-Overlapping Wards & Dumpsite Drops",
      bannerText: "Verify compactor availability, enforce zero political-ward overlap, monitor free dumpsite entry logs, and validate 2027 PSP annual license renewals online.",
      highlightKpis: ["licenses", "settled"]
    },
    {
      id: "prs",
      label: "Planning, Research & Stats",
      bannerTitle: "PRS Lens — Service Delivery Data vs. Payment Compliance Analytics",
      bannerText: "Automated monthly trend summaries comparing enumerated entities, verified doorstep/industrial pickups, and payment compliance across all 20 LGAs.",
      highlightKpis: ["capture", "collections"]
    },
    {
      id: "recycling",
      label: "Recycling Dept",
      bannerTitle: "Recycling Lens — Waste Vendors (₦200k), HSE Compliance & Community Hubs",
      bannerText: "Protect licensed waste vendors from factory HSE double-crossing via QR gate verification while formalizing residential aggregators and community recycling hubs.",
      highlightKpis: ["licenses", "capture"]
    }
  ],

  monthlyTrend: [
    { month: "Jun", industrial: 22.4, residential: 6.1, licensing: 2.2 },
    { month: "Jul", industrial: 25.8, residential: 7.4, licensing: 2.5 },
    { month: "Aug", industrial: 28.9, residential: 8.9, licensing: 3.1 },
    { month: "Sep", industrial: 31.6, residential: 10.2, licensing: 3.8 },
    { month: "Oct", industrial: 34.5, residential: 11.4, licensing: 5.4 },
    { month: "Nov", industrial: 37.8, residential: 12.9, licensing: 7.2 }
  ],

  corridorGap: [
    { corridor: "Abeokuta South (Ibara / Oke-Ilewo)", entities: 1420, pickupRate: 91, payCompliance: 86, status: "Strong" },
    { corridor: "Ado-Odo/Ota (Agbara Industrial)", entities: 680, pickupRate: 88, payCompliance: 79, status: "Watch" },
    { corridor: "Sagamu (Interchange Corridor)", entities: 540, pickupRate: 84, payCompliance: 74, status: "Watch" },
    { corridor: "Abeokuta North (Lafenwa / Sabo)", entities: 980, pickupRate: 76, payCompliance: 64, status: "Gap Alert" },
    { corridor: "Obafemi-Owode (Mowe / Ibafo)", entities: 1150, pickupRate: 72, payCompliance: 59, status: "Gap Alert" }
  ],

  industrialClients: [
    {
      id: "FAC-OG-1042",
      name: "Agbara Packaging & Foods Ltd",
      corridor: "Ado-Odo/Ota (Agbara)",
      assignedPsp: "GreenHaul Ogun Environmental Ltd",
      pspAccount: "Zenith Bank •••• 4821",
      monthlyBill: 1450000,
      assignedVendors: ["OGW-VND-2027-0148", "OGW-VND-2027-0152"]
    },
    {
      id: "FAC-OG-1089",
      name: "Sagamu Steel & Logistics Plc",
      corridor: "Sagamu Interchange",
      assignedPsp: "Gateway Compactors Nigeria Ltd",
      pspAccount: "Access Bank •••• 9104",
      monthlyBill: 2100000,
      assignedVendors: ["OGW-VND-2027-0148"]
    },
    {
      id: "FAC-OG-1120",
      name: "Oke-Ilewo Commercial Plaza & Mall",
      corridor: "Abeokuta South",
      assignedPsp: "RockCity CleanWaste PSP",
      pspAccount: "GTBank •••• 3319",
      monthlyBill: 650000,
      assignedVendors: ["OGW-VND-2027-0161"]
    },
    {
      id: "FAC-OG-1185",
      name: "Igbesa Paper & Corrugated Mill",
      corridor: "Ado-Odo/Ota (Igbesa)",
      assignedPsp: "GreenHaul Ogun Environmental Ltd",
      pspAccount: "Zenith Bank •••• 4821",
      monthlyBill: 1800000,
      assignedVendors: ["OGW-VND-2027-0152"]
    }
  ],

  estates: [
    {
      id: "EST-ABK-201",
      name: "IBB Boulevard / GRA Residents Estate CDC",
      corridor: "Abeokuta South — Ward 04",
      assignedPsp: "RockCity CleanWaste PSP",
      pspAccount: "GTBank •••• 3319",
      units: 185,
      ratePerUnit: 3500
    },
    {
      id: "EST-ABK-214",
      name: "Kemta Housing Estate Phase II CDC",
      corridor: "Abeokuta South — Ward 09",
      assignedPsp: "Olumo EcoLogistics Ltd",
      pspAccount: "FirstBank •••• 7740",
      units: 240,
      ratePerUnit: 3000
    },
    {
      id: "EST-MOW-305",
      name: "Redemption Corridor Organised Estate CDC",
      corridor: "Obafemi-Owode — Ward 06",
      assignedPsp: "Mowe-Ibafo Civic Waste PSP",
      pspAccount: "UBA •••• 2298",
      units: 320,
      ratePerUnit: 2500
    }
  ],

  transactions: [
    {
      ref: "OGW-SPL-261126-084",
      time: "Today, 07:18 AM",
      payer: "Agbara Packaging & Foods Ltd",
      facilityId: "FAC-OG-1042",
      track: "Industrial 60/40",
      psp: "GreenHaul Ogun Environmental Ltd",
      gross: 1450000,
      pspShare: 870000,
      ogwamaShare: 580000,
      platformFee: 29000,
      settlementTime: "42 sec",
      escrowVerified: true,
      status: "Settled Instantly"
    },
    {
      ref: "OGW-SPL-261126-081",
      time: "Today, 06:54 AM",
      payer: "IBB Boulevard / GRA Residents Estate CDC",
      facilityId: "EST-ABK-201",
      track: "Estate/CDC 80/20",
      psp: "RockCity CleanWaste PSP",
      gross: 647500,
      pspShare: 518000,
      ogwamaShare: 129500,
      platformFee: 9713,
      settlementTime: "38 sec",
      escrowVerified: true,
      status: "Settled Instantly"
    },
    {
      ref: "OGW-LIC-261125-419",
      time: "Yesterday, 04:22 PM",
      payer: "EcoCycle Ogun Plastics Ltd",
      facilityId: "OGW-VND-2027-0148",
      track: "2027 Licensing",
      psp: "OGWAMA Direct (100%)",
      gross: 200000,
      pspShare: 0,
      ogwamaShare: 200000,
      platformFee: 7500,
      settlementTime: "19 sec",
      escrowVerified: false,
      status: "Settled Instantly"
    },
    {
      ref: "OGW-SPL-261125-392",
      time: "Yesterday, 02:10 PM",
      payer: "Sagamu Steel & Logistics Plc",
      facilityId: "FAC-OG-1089",
      track: "Industrial 60/40",
      psp: "Gateway Compactors Nigeria Ltd",
      gross: 2100000,
      pspShare: 1260000,
      ogwamaShare: 840000,
      platformFee: 42000,
      settlementTime: "51 sec",
      escrowVerified: true,
      status: "Settled Instantly"
    },
    {
      ref: "OGW-SPL-261124-311",
      time: "Nov 24, 11:05 AM",
      payer: "Oke-Ilewo Commercial Plaza & Mall",
      facilityId: "FAC-OG-1120",
      track: "Industrial 60/40",
      psp: "RockCity CleanWaste PSP",
      gross: 650000,
      pspShare: 390000,
      ogwamaShare: 260000,
      platformFee: 13000,
      settlementTime: "44 sec",
      escrowVerified: true,
      status: "Settled Instantly"
    }
  ],

  wards: [
    {
      id: "ABK-S-04",
      lga: "Abeokuta South",
      ward: "Ward 04 — Ibara / Oke-Ilewo",
      psp: "RockCity CleanWaste PSP",
      pspLicense: "OGW-PSP-2027-0012",
      schedule: "Tue & Fri • 06:30 AM",
      compactors: 3,
      pickupCompliance: 94,
      payCompliance: 89,
      dumpsiteDrops: 48,
      openTickets: 1,
      occupied: true
    },
    {
      id: "ABK-S-09",
      lga: "Abeokuta South",
      ward: "Ward 09 — Kemta / Idi-Aba",
      psp: "Olumo EcoLogistics Ltd",
      pspLicense: "OGW-PSP-2027-0019",
      schedule: "Mon & Thu • 07:00 AM",
      compactors: 2,
      pickupCompliance: 88,
      payCompliance: 81,
      dumpsiteDrops: 36,
      openTickets: 2,
      occupied: true
    },
    {
      id: "ABK-N-03",
      lga: "Abeokuta North",
      ward: "Ward 03 — Lafenwa / Sabo",
      psp: "Gateway North Sanitation Ltd",
      pspLicense: "OGW-PSP-2027-0027",
      schedule: "Wed & Sat • 06:00 AM",
      compactors: 2,
      pickupCompliance: 74,
      payCompliance: 63,
      dumpsiteDrops: 29,
      openTickets: 5,
      occupied: true
    },
    {
      id: "OTA-02",
      lga: "Ado-Odo / Ota",
      ward: "Ward 02 — Agbara Industrial",
      psp: "GreenHaul Ogun Environmental Ltd",
      pspLicense: "OGW-PSP-2027-0008",
      schedule: "Daily Industrial • 05:30 AM",
      compactors: 5,
      pickupCompliance: 92,
      payCompliance: 84,
      dumpsiteDrops: 82,
      openTickets: 1,
      occupied: true
    },
    {
      id: "SAG-05",
      lga: "Sagamu",
      ward: "Ward 05 — Interchange Industrial",
      psp: "Gateway Compactors Nigeria Ltd",
      pspLicense: "OGW-PSP-2027-0015",
      schedule: "Mon / Wed / Fri • 06:00 AM",
      compactors: 4,
      pickupCompliance: 86,
      payCompliance: 77,
      dumpsiteDrops: 61,
      openTickets: 2,
      occupied: true
    },
    {
      id: "IJB-01",
      lga: "Ijebu-Ode",
      ward: "Ward 01 — Italapo / Central",
      psp: "Open Ward — Available for 2027 Allocation",
      pspLicense: null,
      schedule: "Pending PSP Allocation",
      compactors: 0,
      pickupCompliance: 0,
      payCompliance: 0,
      dumpsiteDrops: 0,
      openTickets: 3,
      occupied: false
    }
  ],

  availableWardsFor2027: [
    { id: "IJB-01", label: "Ijebu-Ode — Ward 01 (Italapo / Central)", locked: false },
    { id: "EWK-04", label: "Ewekoro — Ward 04 (Papalanto Corridor)", locked: false },
    { id: "IFO-07", label: "Ifo — Ward 07 (Agbado / Coker)", locked: false },
    { id: "ABK-S-04", label: "Abeokuta South — Ward 04 (Ibara / Oke-Ilewo) [ASSIGNED: RockCity]", locked: true },
    { id: "OTA-02", label: "Ado-Odo/Ota — Ward 02 (Agbara Industrial) [ASSIGNED: GreenHaul]", locked: true }
  ],

  pendingApplications: [
    {
      appId: "APP-2027-0881",
      type: "PSP Annual License",
      company: "OgunEast CleanFleet Ltd",
      rcNumber: "RC-1944208",
      wardOrScope: "Ijebu-Ode — Ward 01 (Italapo / Central)",
      feePaid: 350000,
      submittedAt: "Today, 07:05 AM",
      trucks: "2 Compactors (OG-441-XA, OG-442-XA)",
      bankAccount: "Sterling Bank •••• 6120",
      checks: { cac: true, tcc3yr: true, procurement: true, truckProof: true, wardOverlapPass: true, conflictPass: true }
    },
    {
      appId: "APP-2027-0879",
      type: "Waste Vendor License",
      company: "Apex Polymer Recovery Nigeria Ltd",
      rcNumber: "RC-2011894",
      wardOrScope: "Agbara Packaging & Foods Ltd, Igbesa Paper Mill (PET / HDPE / Cartons)",
      feePaid: 200000,
      submittedAt: "Yesterday, 03:40 PM",
      trucks: "1 Covered Recyclables Van (OG-819-KB)",
      bankAccount: "N/A (Direct Industry Purchase)",
      checks: { cac: true, tcc3yr: true, procurement: true, truckProof: true, wardOverlapPass: true, conflictPass: true }
    },
    {
      appId: "APP-2027-0874",
      type: "Special Permit",
      company: "Abeokuta Medical Diagnostics Hub",
      rcNumber: "RC-1509832",
      wardOrScope: "Clinical / Sharps Treated Waste Haulage (Q1 2027)",
      feePaid: 150000,
      submittedAt: "Nov 24, 01:15 PM",
      trucks: "1 Bio-Sealed Van (OG-102-MD)",
      bankAccount: "N/A (Direct Permit)",
      checks: { cac: true, tcc3yr: true, procurement: true, truckProof: true, wardOverlapPass: true, conflictPass: true }
    }
  ],

  licenses: [
    {
      licenseId: "OGW-PSP-2027-0012",
      type: "PSP Annual License",
      company: "RockCity CleanWaste PSP",
      rcNumber: "RC-1482011",
      status: "VALID",
      scope: "General Solid Waste Collection (Residential & Commercial)",
      assignedArea: "Abeokuta South — Ward 04 (Ibara / Oke-Ilewo)",
      trucks: "3 Compactors (OG-201-RC, OG-202-RC, OG-203-RC)",
      validUntil: "31 Dec 2027",
      warningNote: "Authorized for General Solid Waste only. Not licensed as an Industrial Waste Vendor."
    },
    {
      licenseId: "OGW-PSP-2027-0008",
      type: "PSP Annual License",
      company: "GreenHaul Ogun Environmental Ltd",
      rcNumber: "RC-1290441",
      status: "VALID",
      scope: "Industrial & Commercial Solid Waste Collection",
      assignedArea: "Ado-Odo/Ota — Ward 02 (Agbara Industrial)",
      trucks: "5 Compactors (OG-881-GH to OG-885-GH)",
      validUntil: "31 Dec 2027",
      warningNote: "Authorized for General Solid Waste only. Instant 60/40 Split Settlement Active."
    },
    {
      licenseId: "OGW-VND-2027-0148",
      type: "Waste Vendor License (₦200k)",
      company: "EcoCycle Ogun Plastics Ltd",
      rcNumber: "RC-1883204",
      status: "VALID",
      scope: "Recyclables Only (PET Plastics, Scrap Metal, Packaging Film)",
      assignedArea: "Designated Companies: Agbara Packaging & Foods Ltd; Sagamu Steel & Logistics Plc",
      trucks: "2 Covered Recyclables Trucks (OG-511-EC, OG-512-EC)",
      validUntil: "31 Dec 2027",
      warningNote: "RECYCLABLES ONLY — Strictly prohibited from hauling general solid waste or operating outside designated companies."
    },
    {
      licenseId: "OGW-VND-2027-0152",
      type: "Waste Vendor License (₦200k)",
      company: "OgunPaper & Fibre Recyclers Ltd",
      rcNumber: "RC-1765190",
      status: "VALID",
      scope: "Recyclables Only (Corrugated Cartons, Industrial Paper)",
      assignedArea: "Designated Companies: Agbara Packaging & Foods Ltd; Igbesa Paper & Corrugated Mill",
      trucks: "2 Flatbed Covered Vans (OG-732-PF, OG-733-PF)",
      validUntil: "31 Dec 2027",
      warningNote: "RECYCLABLES ONLY — Co-assigned vendor at Agbara Packaging. General waste must go to GreenHaul PSP."
    },
    {
      licenseId: "OGW-VND-FAKE-99",
      type: "Unregistered / Expired Operator",
      company: "Unverified Scrap Collector (Flagged at Agbara Gate)",
      rcNumber: "NOT ON FILE",
      status: "UNLICENSED",
      scope: "UNAUTHORIZED — No 2027 OGWAMA License Found",
      assignedArea: "No Designated Industrial Assignment",
      trucks: "Unregistered Open Tipper",
      validUntil: "EXPIRED / INVALID",
      warningNote: "DO NOT RELEASE WASTE OR RECYCLABLES. Alert Commercial Officer & OGWAMA Enforcement immediately."
    }
  ],

  recyclingManifests: [
    {
      id: "MNF-2611-04",
      factory: "Agbara Packaging & Foods Ltd",
      generalPsp: "GreenHaul Ogun PSP (2.8t General)",
      licensedVendor: "EcoCycle Ogun Plastics (1.4t PET)",
      hseStatus: "Compliant",
      lastAudit: "Today, 07:10 AM"
    },
    {
      id: "MNF-2611-03",
      factory: "Igbesa Paper & Corrugated Mill",
      generalPsp: "GreenHaul Ogun PSP (0.4t — Low!)",
      licensedVendor: "OgunPaper Recyclers (3.9t Mixed?)",
      hseStatus: "HSE Review Flagged",
      lastAudit: "Yesterday, 05:15 PM"
    },
    {
      id: "MNF-2611-02",
      factory: "Sagamu Steel & Logistics Plc",
      generalPsp: "Gateway Compactors (3.1t General)",
      licensedVendor: "EcoCycle Ogun Plastics (2.1t Scrap)",
      hseStatus: "Compliant",
      lastAudit: "Yesterday, 02:30 PM"
    }
  ],

  communityHubs: [
    { hub: "Ibara Community Recycling Hub (Pilot)", aggregators: 34, kgMonth: "14,200 kg", incentivePaid: "₦1,136,000" },
    { hub: "Lafenwa Market Recovery Point", aggregators: 52, kgMonth: "21,850 kg", incentivePaid: "₦1,748,000" },
    { hub: "Saje Dumpsite Scavenger Co-op", aggregators: 89, kgMonth: "38,400 kg", incentivePaid: "₦2,688,000" }
  ],

  activityFeed: [
    { color: "#16a34a", title: "Instant 60/40 Split Settled — Agbara Packaging", sub: "₦870,000 credited to GreenHaul PSP • ₦580,000 to OGWAMA Treasury (42 sec)" },
    { color: "#d4a017", title: "New 2027 PSP Application Submitted Online", sub: "OgunEast CleanFleet Ltd applied for Ijebu-Ode Ward 01 — 0 overlap conflict" },
    { color: "#16a34a", title: "Estate Bulk Bill (80/20) Settled — IBB Boulevard CDC", sub: "185 enumerated units • ₦518,000 to RockCity PSP • ₦129,500 to OGWAMA" },
    { color: "#b42318", title: "HSE Double-Cross Risk Flagged — Igbesa Paper Mill", sub: "General waste tonnage dropped 65% while vendor load spiked; Commercial Officer notified" }
  ]
};
