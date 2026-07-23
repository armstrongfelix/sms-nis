const RANK_LEVELS = {
  IA3: 1, IA2: 2, IA1: 3, AII: 4, II: 5,
  ASI2: 6, ASI1: 7, DSI: 8, SI: 9, CSI: 10,
  ACI: 11, DCI: 12, CIS: 13, ACG: 14, DCG: 15, CG: 16,
};

export const ZONES = [
  "SHQ", "ZONEA", "ZONEB", "ZONEC", "ZONED",
  "ZONEE", "ZONEF", "ZONEG", "ZONEH",
];

export const FORMATIONS = [
  "SHQ", "ZONEA", "ZONEB", "ZONEC", "ZONED", "ZONEE", "ZONEF", "ZONEG", "ZONEH",
  "ABSC", "ADSC", "AKSC", "ANSC", "BASC", "BESC", "BOSC", "BYSC",
  "CRSC", "DESC", "EBSC", "EDSC", "EKSC", "ENSC", "FCSC", "GOSC",
  "IMSC", "JISC", "KDSC", "KESC", "KNSC", "KOSC", "KTSC", "KWSC",
  "LASC", "NASC", "NISC", "OGSC", "ONSC", "OSSC", "OYSC", "PLSC",
  "RISC", "SOSC", "TASC", "YOSC", "ZASC",
  "NITSOL", "NITSA", "ITSK",
  "MMIA", "NAIA", "NFBC", "SEBC", "IDBC", "RVMC",
];

export const RANKS = Object.keys(RANK_LEVELS);

export function getRankLevel(rank) {
  return RANK_LEVELS[rank] ?? 99;
}

function applyFilters(staff, filters = {}) {
  const { zone, formation, rank, sex, dateRange } = filters;
  if (!zone && !formation && !rank && !sex && !dateRange) return staff;
  return staff.filter(s => {
    if (zone && s.zone !== zone) return false;
    if (formation && s.formation !== formation) return false;
    if (rank && s.rank !== rank) return false;
    if (sex && s.gender !== sex) return false;
    if (dateRange) {
      const d = new Date(s.dateOfFirstAppointment);
      if (dateRange.start && d < new Date(dateRange.start)) return false;
      if (dateRange.end && d > new Date(dateRange.end)) return false;
    }
    return true;
  });
}

export function getTotalStrength(staff, filters) {
  if (!staff) return 0;
  return applyFilters(staff, filters).length;
}

export function getCountByZone(staff, filters) {
  if (!staff) return [];
  const filtered = applyFilters(staff, filters);
  const map = {};
  for (const s of filtered) {
    const key = s.zone || "Unknown";
    map[key] = (map[key] || 0) + 1;
  }
  return Object.entries(map)
    .map(([zone, count]) => ({ zone, count }))
    .sort((a, b) => b.count - a.count);
}

export function getCountByFormation(staff, filters) {
  if (!staff) return [];
  const filtered = applyFilters(staff, filters);
  const map = {};
  for (const s of filtered) {
    const key = s.formation || "Unknown";
    map[key] = (map[key] || 0) + 1;
  }
  return Object.entries(map)
    .map(([formation, count]) => ({ formation, count }))
    .sort((a, b) => b.count - a.count);
}

export function getRankDistribution(staff, filters) {
  if (!staff) return [];
  const filtered = applyFilters(staff, filters);
  const map = {};
  for (const s of filtered) {
    const rank = s.rank || "Unknown";
    if (!map[rank]) {
      map[rank] = { rank, count: 0, rankLevel: getRankLevel(rank) };
    }
    map[rank].count++;
  }
  return Object.values(map).sort((a, b) => a.rankLevel - b.rankLevel);
}

export function getSexDistribution(staff, filters) {
  if (!staff) return [];
  const filtered = applyFilters(staff, filters);
  const map = {};
  for (const s of filtered) {
    const sex = s.gender || "Unknown";
    map[sex] = (map[sex] || 0) + 1;
  }
  return Object.entries(map).map(([sex, count]) => ({ sex, count }));
}

export function getRankBySex(staff, filters) {
  if (!staff) return [];
  const filtered = applyFilters(staff, filters);
  const map = {};
  for (const s of filtered) {
    const rank = s.rank || "Unknown";
    if (!map[rank]) {
      map[rank] = { rank, male: 0, female: 0, rankLevel: getRankLevel(rank) };
    }
    if (s.gender === "Male") map[rank].male++;
    else if (s.gender === "Female") map[rank].female++;
  }
  return Object.values(map).sort((a, b) => a.rankLevel - b.rankLevel);
}

export function getSexRatioByFormation(staff) {
  if (!staff) return [];
  const map = {};
  for (const s of staff) {
    const formation = s.formation || "Unknown";
    if (!map[formation]) {
      map[formation] = { formation, male: 0, female: 0 };
    }
    if (s.gender === "Male") map[formation].male++;
    else if (s.gender === "Female") map[formation].female++;
  }
  return Object.values(map)
    .map(f => {
      const total = f.male + f.female;
      return {
        ...f,
        malePercent: total ? Math.round((f.male / total) * 100) : 0,
        femalePercent: total ? Math.round((f.female / total) * 100) : 0,
      };
    })
    .sort((a, b) => (a.male + a.female) - (b.male + b.female));
}

export function getFormationsByZone(staff, zone) {
  if (!staff || !zone) return [];
  const set = new Set();
  for (const s of staff) {
    if (s.zone === zone) set.add(s.formation);
  }
  return Array.from(set).sort();
}

export function getFilteredStaff(staff, filters) {
  return applyFilters(staff, filters);
}
