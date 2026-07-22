import { useState, useEffect } from "react";

/* ============================================================
   SIMULADOR DE CARRERA — estilo minimalista tipo Copero
   ------------------------------------------------------------
   Loop por temporada (2 decisiones):
   1) MERCADO: ¿seguís en tu club o fichás por uno que te oferta?
      Si rendiste mal, el club te suelta y estás OBLIGADO a elegir
      otra oferta (aunque sea de un club más chico).
   2) PRETEMPORADA: ¿en qué invertís tu plata? (preparador, fisios,
      agente, indirecta gratis, o guardar)
   Después la temporada se simula sola y se suma a la tabla.
   ============================================================ */

// ---------- DATOS ----------

const POSITIONS = ["POR","LD","DFC","LI","MCD","MC","MCO","MD","MI","ED","EI","DC"];

// prestige: qué tanto te desarrolla el club | req: OVR mínimo aprox.
const CLUBS = [
  { id: "river", name: "River Plate", league: "Liga Profesional (ARG)", tier: 3, req: 76, prestige: 86 },
  { id: "boca", name: "Boca Juniors", league: "Liga Profesional (ARG)", tier: 3, req: 75, prestige: 85 },
  { id: "racing", name: "Racing", league: "Liga Profesional (ARG)", tier: 3, req: 70, prestige: 72 },
  { id: "independiente", name: "Independiente", league: "Liga Profesional (ARG)", tier: 3, req: 66, prestige: 64 },
  { id: "sanlo", name: "San Lorenzo", league: "Liga Profesional (ARG)", tier: 3, req: 66, prestige: 63 },
  { id: "estudiantes", name: "Estudiantes", league: "Liga Profesional (ARG)", tier: 3, req: 68, prestige: 66 },
  { id: "velez", name: "Vélez", league: "Liga Profesional (ARG)", tier: 3, req: 67, prestige: 65 },
  { id: "huracan", name: "Huracán", league: "Liga Profesional (ARG)", tier: 2, req: 62, prestige: 54 },
  { id: "lanus", name: "Lanús", league: "Liga Profesional (ARG)", tier: 3, req: 65, prestige: 60 },
  { id: "newells", name: "Newell\'s", league: "Liga Profesional (ARG)", tier: 2, req: 63, prestige: 56 },
  { id: "central", name: "Rosario Central", league: "Liga Profesional (ARG)", tier: 2, req: 63, prestige: 55 },
  { id: "defensa", name: "Defensa y Justicia", league: "Liga Profesional (ARG)", tier: 2, req: 62, prestige: 53 },
  { id: "talleres", name: "Talleres", league: "Liga Profesional (ARG)", tier: 3, req: 66, prestige: 62 },
  { id: "godoy", name: "Godoy Cruz", league: "Liga Profesional (ARG)", tier: 2, req: 61, prestige: 50 },
  { id: "argjrs", name: "Argentinos Juniors", league: "Liga Profesional (ARG)", tier: 2, req: 62, prestige: 52 },
  { id: "tigre", name: "Tigre", league: "Liga Profesional (ARG)", tier: 2, req: 58, prestige: 45 },
  { id: "platense", name: "Platense", league: "Liga Profesional (ARG)", tier: 2, req: 57, prestige: 43 },
  { id: "banfield", name: "Banfield", league: "Liga Profesional (ARG)", tier: 2, req: 59, prestige: 47 },
  { id: "gimnasia", name: "Gimnasia LP", league: "Liga Profesional (ARG)", tier: 2, req: 58, prestige: 44 },
  { id: "instituto", name: "Instituto", league: "Liga Profesional (ARG)", tier: 2, req: 57, prestige: 42 },
  { id: "belgrano", name: "Belgrano", league: "Liga Profesional (ARG)", tier: 2, req: 59, prestige: 46 },
  { id: "colon", name: "Colón", league: "Liga Profesional (ARG)", tier: 2, req: 58, prestige: 44 },
  { id: "union", name: "Unión", league: "Liga Profesional (ARG)", tier: 2, req: 58, prestige: 45 },
  { id: "barracas", name: "Barracas Central", league: "Liga Profesional (ARG)", tier: 2, req: 55, prestige: 40 },
  { id: "sarmiento", name: "Sarmiento", league: "Liga Profesional (ARG)", tier: 2, req: 54, prestige: 38 },
  { id: "aldosivi", name: "Aldosivi", league: "Liga Profesional (ARG)", tier: 2, req: 54, prestige: 38 },
  { id: "riestra", name: "Dep. Riestra", league: "Liga Profesional (ARG)", tier: 2, req: 53, prestige: 36 },
  { id: "chaca", name: "Chacarita", league: "Primera Nacional (ARG)", tier: 1, req: 48, prestige: 30 },
  { id: "quilmes", name: "Quilmes", league: "Primera Nacional (ARG)", tier: 1, req: 47, prestige: 28 },
  { id: "moron", name: "Dep. Morón", league: "Primera Nacional (ARG)", tier: 1, req: 46, prestige: 26 },
  { id: "sanmartin", name: "San Martín T.", league: "Primera Nacional (ARG)", tier: 1, req: 46, prestige: 25 },
  { id: "nueva", name: "Nueva Chicago", league: "Primera Nacional (ARG)", tier: 1, req: 46, prestige: 26 },
  { id: "almirante", name: "Alte. Brown", league: "Primera Nacional (ARG)", tier: 1, req: 46, prestige: 26 },
  { id: "gimnasiaj", name: "Gimnasia Jujuy", league: "Primera Nacional (ARG)", tier: 1, req: 45, prestige: 22 },
  { id: "temperley", name: "Temperley", league: "Primera Nacional (ARG)", tier: 1, req: 44, prestige: 20 },
  { id: "madrid", name: "Real Madrid", league: "La Liga (ESP)", tier: 5, req: 86, prestige: 100 },
  { id: "barcelona", name: "Barcelona", league: "La Liga (ESP)", tier: 5, req: 85, prestige: 99 },
  { id: "atletico", name: "Atlético Madrid", league: "La Liga (ESP)", tier: 4, req: 82, prestige: 90 },
  { id: "sevilla", name: "Sevilla", league: "La Liga (ESP)", tier: 4, req: 78, prestige: 84 },
  { id: "realsociedad", name: "Real Sociedad", league: "La Liga (ESP)", tier: 4, req: 78, prestige: 83 },
  { id: "betis", name: "Real Betis", league: "La Liga (ESP)", tier: 4, req: 77, prestige: 80 },
  { id: "villarreal", name: "Villarreal", league: "La Liga (ESP)", tier: 4, req: 78, prestige: 82 },
  { id: "athletic", name: "Athletic Club", league: "La Liga (ESP)", tier: 4, req: 77, prestige: 80 },
  { id: "valencia", name: "Valencia", league: "La Liga (ESP)", tier: 4, req: 76, prestige: 78 },
  { id: "girona", name: "Girona", league: "La Liga (ESP)", tier: 4, req: 76, prestige: 77 },
  { id: "osasuna", name: "Osasuna", league: "La Liga (ESP)", tier: 4, req: 72, prestige: 68 },
  { id: "celta", name: "Celta", league: "La Liga (ESP)", tier: 4, req: 72, prestige: 67 },
  { id: "getafe", name: "Getafe", league: "La Liga (ESP)", tier: 4, req: 71, prestige: 65 },
  { id: "mallorca", name: "Mallorca", league: "La Liga (ESP)", tier: 4, req: 71, prestige: 64 },
  { id: "rayo", name: "Rayo Vallecano", league: "La Liga (ESP)", tier: 4, req: 70, prestige: 62 },
  { id: "alaves", name: "Alavés", league: "La Liga (ESP)", tier: 4, req: 69, prestige: 60 },
  { id: "laspalmas", name: "Las Palmas", league: "La Liga (ESP)", tier: 4, req: 69, prestige: 60 },
  { id: "leganes", name: "Leganés", league: "La Liga (ESP)", tier: 4, req: 68, prestige: 58 },
  { id: "valladolid", name: "Valladolid", league: "La Liga (ESP)", tier: 4, req: 67, prestige: 56 },
  { id: "espanyol", name: "Espanyol", league: "La Liga (ESP)", tier: 4, req: 68, prestige: 58 },
  { id: "bayern", name: "Bayern Múnich", league: "Bundesliga (GER)", tier: 5, req: 85, prestige: 99 },
  { id: "dortmund", name: "Dortmund", league: "Bundesliga (GER)", tier: 4, req: 81, prestige: 88 },
  { id: "leverkusen", name: "Leverkusen", league: "Bundesliga (GER)", tier: 4, req: 82, prestige: 89 },
  { id: "leipzig", name: "RB Leipzig", league: "Bundesliga (GER)", tier: 4, req: 80, prestige: 86 },
  { id: "stuttgart", name: "Stuttgart", league: "Bundesliga (GER)", tier: 4, req: 77, prestige: 79 },
  { id: "frankfurt", name: "E. Frankfurt", league: "Bundesliga (GER)", tier: 4, req: 77, prestige: 78 },
  { id: "freiburg", name: "Friburgo", league: "Bundesliga (GER)", tier: 4, req: 74, prestige: 72 },
  { id: "wolfsburg", name: "Wolfsburgo", league: "Bundesliga (GER)", tier: 4, req: 74, prestige: 71 },
  { id: "gladbach", name: "M\'gladbach", league: "Bundesliga (GER)", tier: 4, req: 73, prestige: 70 },
  { id: "mainz", name: "Mainz", league: "Bundesliga (GER)", tier: 4, req: 71, prestige: 64 },
  { id: "hoffenheim", name: "Hoffenheim", league: "Bundesliga (GER)", tier: 4, req: 72, prestige: 66 },
  { id: "bremen", name: "Werder Bremen", league: "Bundesliga (GER)", tier: 4, req: 72, prestige: 66 },
  { id: "augsburg", name: "Augsburgo", league: "Bundesliga (GER)", tier: 4, req: 70, prestige: 62 },
  { id: "union2", name: "Union Berlin", league: "Bundesliga (GER)", tier: 4, req: 71, prestige: 64 },
  { id: "bochum", name: "Bochum", league: "Bundesliga (GER)", tier: 4, req: 68, prestige: 56 },
  { id: "heidenheim", name: "Heidenheim", league: "Bundesliga (GER)", tier: 4, req: 67, prestige: 54 },
  { id: "stpauli", name: "St. Pauli", league: "Bundesliga (GER)", tier: 4, req: 67, prestige: 54 },
  { id: "holstein", name: "Holstein Kiel", league: "Bundesliga (GER)", tier: 4, req: 66, prestige: 52 },
  { id: "inter", name: "Inter", league: "Serie A (ITA)", tier: 5, req: 84, prestige: 95 },
  { id: "milan", name: "Milan", league: "Serie A (ITA)", tier: 4, req: 82, prestige: 92 },
  { id: "juventus", name: "Juventus", league: "Serie A (ITA)", tier: 4, req: 82, prestige: 91 },
  { id: "napoli", name: "Napoli", league: "Serie A (ITA)", tier: 4, req: 82, prestige: 90 },
  { id: "roma", name: "Roma", league: "Serie A (ITA)", tier: 4, req: 79, prestige: 85 },
  { id: "lazio", name: "Lazio", league: "Serie A (ITA)", tier: 4, req: 78, prestige: 82 },
  { id: "atalanta", name: "Atalanta", league: "Serie A (ITA)", tier: 4, req: 80, prestige: 86 },
  { id: "fiorentina", name: "Fiorentina", league: "Serie A (ITA)", tier: 4, req: 77, prestige: 79 },
  { id: "bologna", name: "Bologna", league: "Serie A (ITA)", tier: 4, req: 76, prestige: 76 },
  { id: "torino", name: "Torino", league: "Serie A (ITA)", tier: 4, req: 73, prestige: 70 },
  { id: "udinese", name: "Udinese", league: "Serie A (ITA)", tier: 4, req: 72, prestige: 66 },
  { id: "genoa", name: "Genoa", league: "Serie A (ITA)", tier: 4, req: 71, prestige: 64 },
  { id: "monza", name: "Monza", league: "Serie A (ITA)", tier: 4, req: 70, prestige: 62 },
  { id: "lecce", name: "Lecce", league: "Serie A (ITA)", tier: 4, req: 69, prestige: 58 },
  { id: "cagliari", name: "Cagliari", league: "Serie A (ITA)", tier: 4, req: 69, prestige: 58 },
  { id: "verona", name: "Verona", league: "Serie A (ITA)", tier: 4, req: 69, prestige: 57 },
  { id: "parma", name: "Parma", league: "Serie A (ITA)", tier: 4, req: 69, prestige: 58 },
  { id: "como", name: "Como", league: "Serie A (ITA)", tier: 4, req: 70, prestige: 60 },
  { id: "empoli", name: "Empoli", league: "Serie A (ITA)", tier: 4, req: 68, prestige: 56 },
  { id: "venezia", name: "Venezia", league: "Serie A (ITA)", tier: 4, req: 67, prestige: 54 },
  { id: "mancity", name: "Man City", league: "Premier League (ENG)", tier: 5, req: 86, prestige: 100 },
  { id: "arsenal", name: "Arsenal", league: "Premier League (ENG)", tier: 5, req: 84, prestige: 95 },
  { id: "liverpool", name: "Liverpool", league: "Premier League (ENG)", tier: 5, req: 85, prestige: 97 },
  { id: "chelsea", name: "Chelsea", league: "Premier League (ENG)", tier: 4, req: 81, prestige: 88 },
  { id: "mancity_utd", name: "Man United", league: "Premier League (ENG)", tier: 4, req: 80, prestige: 88 },
  { id: "tottenham", name: "Tottenham", league: "Premier League (ENG)", tier: 4, req: 80, prestige: 86 },
  { id: "newcastle", name: "Newcastle", league: "Premier League (ENG)", tier: 4, req: 79, prestige: 84 },
  { id: "villa", name: "Aston Villa", league: "Premier League (ENG)", tier: 4, req: 79, prestige: 83 },
  { id: "westham", name: "West Ham", league: "Premier League (ENG)", tier: 4, req: 76, prestige: 76 },
  { id: "brighton", name: "Brighton", league: "Premier League (ENG)", tier: 4, req: 76, prestige: 76 },
  { id: "bournemouth", name: "Bournemouth", league: "Premier League (ENG)", tier: 4, req: 74, prestige: 70 },
  { id: "palace", name: "Crystal Palace", league: "Premier League (ENG)", tier: 4, req: 74, prestige: 70 },
  { id: "fulham", name: "Fulham", league: "Premier League (ENG)", tier: 4, req: 74, prestige: 69 },
  { id: "wolves", name: "Wolves", league: "Premier League (ENG)", tier: 4, req: 73, prestige: 68 },
  { id: "everton", name: "Everton", league: "Premier League (ENG)", tier: 4, req: 73, prestige: 67 },
  { id: "brentford", name: "Brentford", league: "Premier League (ENG)", tier: 4, req: 74, prestige: 69 },
  { id: "forest", name: "Nott\'m Forest", league: "Premier League (ENG)", tier: 4, req: 73, prestige: 67 },
  { id: "leicester", name: "Leicester", league: "Premier League (ENG)", tier: 4, req: 72, prestige: 66 },
  { id: "ipswich", name: "Ipswich", league: "Premier League (ENG)", tier: 4, req: 70, prestige: 60 },
  { id: "southampton", name: "Southampton", league: "Premier League (ENG)", tier: 4, req: 70, prestige: 60 },
  { id: "leeds", name: "Leeds", league: "Championship (ENG)", tier: 3, req: 70, prestige: 64 },
  { id: "burnley", name: "Burnley", league: "Championship (ENG)", tier: 3, req: 69, prestige: 62 },
  { id: "sheffield", name: "Sheffield Utd", league: "Championship (ENG)", tier: 3, req: 68, prestige: 60 },
  { id: "sunderland", name: "Sunderland", league: "Championship (ENG)", tier: 3, req: 67, prestige: 58 },
  { id: "westbrom", name: "West Brom", league: "Championship (ENG)", tier: 3, req: 67, prestige: 57 },
  { id: "norwich", name: "Norwich", league: "Championship (ENG)", tier: 3, req: 66, prestige: 56 },
  { id: "middlesbrough", name: "Middlesbrough", league: "Championship (ENG)", tier: 3, req: 66, prestige: 55 },
  { id: "coventry", name: "Coventry", league: "Championship (ENG)", tier: 3, req: 65, prestige: 54 },
  { id: "hull", name: "Hull City", league: "Championship (ENG)", tier: 3, req: 64, prestige: 50 },
  { id: "watford", name: "Watford", league: "Championship (ENG)", tier: 3, req: 65, prestige: 53 },
  { id: "bristol", name: "Bristol City", league: "Championship (ENG)", tier: 3, req: 64, prestige: 50 },
  { id: "cardiff", name: "Cardiff", league: "Championship (ENG)", tier: 3, req: 63, prestige: 48 },
  { id: "nacional", name: "Atl. Nacional", league: "Primera A (COL)", tier: 3, req: 68, prestige: 64 },
  { id: "millonarios", name: "Millonarios", league: "Primera A (COL)", tier: 3, req: 66, prestige: 60 },
  { id: "america_cali", name: "América de Cali", league: "Primera A (COL)", tier: 3, req: 66, prestige: 60 },
  { id: "junior", name: "Junior", league: "Primera A (COL)", tier: 3, req: 66, prestige: 59 },
  { id: "cali", name: "Dep. Cali", league: "Primera A (COL)", tier: 2, req: 63, prestige: 52 },
  { id: "medellin", name: "Ind. Medellín", league: "Primera A (COL)", tier: 2, req: 63, prestige: 52 },
  { id: "tolima", name: "Dep. Tolima", league: "Primera A (COL)", tier: 2, req: 63, prestige: 53 },
  { id: "santafe", name: "Santa Fe", league: "Primera A (COL)", tier: 2, req: 63, prestige: 52 },
  { id: "bucaramanga", name: "Bucaramanga", league: "Primera A (COL)", tier: 2, req: 60, prestige: 46 },
  { id: "pereira", name: "Dep. Pereira", league: "Primera A (COL)", tier: 2, req: 60, prestige: 46 },
  { id: "pasto", name: "Dep. Pasto", league: "Primera A (COL)", tier: 2, req: 58, prestige: 42 },
  { id: "aguilas", name: "Águilas Doradas", league: "Primera A (COL)", tier: 2, req: 58, prestige: 42 },
];

// Clásicos: tirarle una indirecta al rival de tu club enfurece a tu hinchada
const RIVALS = {
  river: "boca", boca: "river",
  racing: "independiente", independiente: "racing",
  sanlo: "huracan", huracan: "sanlo",
  newells: "central", central: "newells",
  estudiantes: "gimnasia", gimnasia: "estudiantes",
  madrid: "barcelona", barcelona: "madrid",
  atletico: "madrid",
  inter: "milan", milan: "inter",
  roma: "lazio", lazio: "roma",
  juventus: "torino", torino: "juventus",
  napoli: "roma",
  liverpool: "mancity_utd", mancity_utd: "liverpool",
  arsenal: "tottenham", tottenham: "arsenal",
  mancity: "mancity_utd",
  everton: "liverpool",
  dortmund: "bayern", bayern: "dortmund",
  nacional: "medellin", medellin: "nacional",
  millonarios: "santafe", santafe: "millonarios",
  america_cali: "cali", cali: "america_cali",
  sevilla: "betis", betis: "sevilla",
  athletic: "realsociedad", realsociedad: "athletic",
};

// Clubes que pueden ofrecerte la cantera: argentinos de las tres primeras categorías,
// desde grandes formadores hasta clubes de ascenso. Se eligen 3 al azar en cada carrera.
const CANTERA_POOL = [
  "river", "boca", "racing", "independiente", "sanlo", "estudiantes", "velez",
  "newells", "central", "lanus", "huracan", "talleres", "defensa", "argjrs",
  "banfield", "colon", "union", "gimnasia", "chaca", "quilmes", "temperley",
];

function pickCantera() {
  const pool = [...CANTERA_POOL];
  const chosen = [];
  for (let i = 0; i < 3 && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    chosen.push(pool.splice(idx, 1)[0]);
  }
  return chosen;
}
const START_AGE = 16;
const RETIRE_AGE = 38;

// ---------- HELPERS ----------

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const rf = (a, b) => a + Math.random() * (b - a);

// Preferencias del jugador guardadas entre carreras (nombre, número, posición).
// Usa localStorage; si no está disponible, degrada silenciosamente al valor por defecto.
function loadPref(key, fallback) {
  try {
    const v = localStorage.getItem("carrerarda_" + key);
    return v === null ? fallback : JSON.parse(v);
  } catch (e) { return fallback; }
}
function savePref(key, value) {
  try { localStorage.setItem("carrerarda_" + key, JSON.stringify(value)); } catch (e) {}
}

// Nombre de liga compacto para pantallas chicas: "Liga Profesional (ARG)" -> "ARG · LPF"
function leagueShort(league) {
  const m = league.match(/^(.*?)\s*\(([^)]+)\)$/);
  if (!m) return league;
  const name = m[1].replace("Primera Nacional", "Primera Nac.").replace("Liga Profesional", "LPF").replace("Premier League", "Premier").replace("Championship", "Champ.").replace("Primera A", "Primera A");
  return `${m[2]} · ${name}`;
}

// Partidos oficiales de liga por país (aprox. reales). El resto de competiciones se suman aparte.
const LEAGUE_MATCHES = {
  ARG: 30, ESP: 38, GER: 34, ITA: 38, ENG: 38, COL: 32,
};
// Copa nacional de cada país (nombre real).
const NATIONAL_CUP = {
  ARG: "Copa Argentina", ESP: "Copa del Rey", GER: "DFB-Pokal",
  ITA: "Coppa Italia", ENG: "FA Cup", COL: "Copa Colombia",
};
// Torneo internacional según la confederación del país.
const INTL_CUP = {
  ARG: "Copa Libertadores", COL: "Copa Libertadores",
  ESP: "Champions League", GER: "Champions League", ITA: "Champions League", ENG: "Champions League",
};
// Devuelve el código de país (ARG, ESP…) a partir del nombre de liga.
function leagueCountry(league) {
  const m = league.match(/\(([^)]+)\)$/);
  return m ? m[1] : "ARG";
}
const club = (id) => CLUBS.find((c) => c.id === id);

// Etiqueta de fecha estilo diario ("DIC 2032"): fin de temporada, año que avanza.
function mesDeTemporada(seasonNum) {
  const year = 2025 + seasonNum;
  return `DIC ${year}`;
}

// Cada rol envejece distinto: el delantero explota joven y decae rápido (vive de piernas),
// el arquero madura tarde y dura hasta el final (vive de lectura de juego)
function ageDelta(age, pos) {
  const g = posGroup(pos);
  const shift = g === "gk" ? 4 : g === "def" ? 2 : g === "mid" ? 1 : 0;
  const a = age - shift;
  if (a <= 21) return rf(2.5, 4.5);
  if (a <= 25) return rf(1.5, 3);
  if (a <= 29) return rf(0, 1.5);
  if (a <= 32) return rf(-1.5, 0.5);
  return rf(-3.5, -1);
}

function marketValue(ovr, age, pos) {
  const base = Math.pow(Math.max(ovr - 40, 1), 3) * 120;
  const ageFactor = age <= 24 ? 1.4 : age <= 28 ? 1.1 : age <= 31 ? 0.8 : 0.4;
  const posFactor = { atk: 1.15, mid: 1.0, def: 0.85, gk: 0.7 }[posGroup(pos)]; // el mercado paga goles
  return Math.round(base * ageFactor * posFactor);
}

function fmtMoney(n) {
  if (n >= 1e6) return `€${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `€${Math.round(n / 1e3)}K`;
  return `€${n}`;
}

// Tier de OVR estilo FIFA Ultimate Team: color según el nivel del jugador.
// Bronce ≤64 · Plata 65-74 · Oro 75-86 · Oro brillante 87-91 · Especial (violeta) 92+
function ovrTier(ovr) {
  if (ovr >= 92) return {
    name: "Especial",
    grad: "from-fuchsia-500 via-purple-600 to-fuchsia-800",
    text: "text-fuchsia-100",
    ring: "ring-fuchsia-400",
  };
  if (ovr >= 87) return {
    name: "Oro brillante",
    grad: "from-yellow-300 via-amber-400 to-yellow-600",
    text: "text-amber-950",
    ring: "ring-yellow-300",
  };
  if (ovr >= 75) return {
    name: "Oro",
    grad: "from-amber-500 via-amber-600 to-amber-800",
    text: "text-amber-50",
    ring: "ring-amber-400",
  };
  if (ovr >= 65) return {
    name: "Plata",
    grad: "from-slate-300 via-slate-400 to-slate-600",
    text: "text-slate-900",
    ring: "ring-slate-300",
  };
  return {
    name: "Bronce",
    grad: "from-orange-800 via-amber-900 to-orange-950",
    text: "text-orange-100",
    ring: "ring-orange-700",
  };
}

const trainerCost = (s) => Math.round(s.wage * 0.4);
const fisioCost = (s) => Math.round(s.wage * 0.35);
const agentCost = (s) => Math.round(s.wage * 1.5);
const pressCost = (s) => Math.round(s.wage * 0.6); // campaña de prensa: sube tu fama esa temporada
const clauseCost = (s) => Math.round(s.wage * 2); // cláusula médica: baja el riesgo de lesión para siempre

// Temporada mala (te avisan) vs desastrosa (te sueltan directo).
// A un juvenil (20 o menos) se lo banca mucho más.
const isBadSeason = (season) => season && (season.age <= 20 ? (season.rating < 5.5 || season.pj < 10) : (season.rating < 5.8 || season.pj < 10));
const isTerribleSeason = (season) => season && (season.age <= 20 ? (season.rating < 5.0 || season.pj < 5) : (season.rating < 5.2 || season.pj < 6));
// Te sueltan con dos malas seguidas, o con una sola desastrosa
const isReleased = (season, badStreak) => isTerribleSeason(season) || (isBadSeason(season) && badStreak >= 1);

// Si sos joven y el club es grande, en vez de soltarte te mandan a préstamo
const shouldLoan = (state, season) =>
  state.age <= 21 && club(state.clubId).tier >= 2 && !state.parentClubId;

// Opciones de préstamo: clubes más chicos donde sí vas a jugar
function loanOptions(state) {
  const current = club(state.clubId);
  // candidatos: clubes de categoría menor donde podrías ir a sumar minutos
  const pool = CLUBS.filter((c) => c.tier < current.tier && c.id !== state.clubId && state.ovr >= c.req - 6);
  // priorizamos los de mejor nivel pero con azar, para que no sean SIEMPRE los mismos 3
  const weighted = pool
    .map((c) => ({ c, w: c.prestige + rf(0, 35) })) // el ruido random mezcla el orden
    .sort((a, b) => b.w - a.w)
    .map((x) => x.c);
  return weighted.slice(0, 3);
}

// ===== MOMENTOS DECISIVOS (#7) =====
// Situaciones puntuales donde el jugador elige. El resultado es mitad OVR, mitad suerte.
// Cada opción tiene una "dificultad" (risk): más difícil = más recompensa si sale, más costo si falla.
const CLUTCH_MOMENTS = [
  {
    id: "penal_final", type: "pitch", emoji: "🥅",
    title: "Penal en la definición",
    setup: "Último minuto, penal para tu equipo en un partido clave. Agarrás la pelota. ¿Dónde la ponés?",
    options: [
      { label: "Al ángulo, imposible de atajar", risk: 0.35, reward: "big", desc: "Si le pegás bien es gol seguro, pero un error y la tirás afuera." },
      { label: "Cruzado, colocado abajo", risk: 0.15, reward: "mid", desc: "La opción del crack: segura y efectiva." },
      { label: "Picarla por el medio (Panenka)", risk: 0.5, reward: "huge", desc: "Si el arquero se tira, es un golazo de época. Si se queda, papelón." },
    ],
  },
  {
    id: "mano_a_mano", type: "pitch", emoji: "⚡",
    title: "Mano a mano decisivo",
    setup: "Quedaste solo frente al arquero en un momento caliente. Definís...",
    options: [
      { label: "Al primer palo, con potencia", risk: 0.25, reward: "big", desc: "Sorprendés al arquero si sos rápido." },
      { label: "Amagar y cruzarla", risk: 0.3, reward: "big", desc: "Si le ganás el tiempo, gol tranquilo." },
      { label: "Picársela por encima", risk: 0.45, reward: "huge", desc: "Sutileza total. Alto riesgo, alta recompensa." },
    ],
  },
  {
    id: "tiro_libre", type: "pitch", emoji: "🎯",
    title: "Tiro libre al borde del área",
    setup: "Falta peligrosa a la altura de la medialuna. La barrera se arma. Ya sabés qué querés hacer.",
    options: [
      { label: "Con comba al ángulo", risk: 0.4, reward: "big", desc: "El tiro de los especialistas." },
      { label: "Rasante por debajo de la barrera", risk: 0.3, reward: "mid", desc: "Astuto y sorpresivo." },
      { label: "Cederla para una jugada ensayada", risk: 0.15, reward: "mid", desc: "Menos glamour, más seguro." },
    ],
  },
  {
    id: "declaraciones", type: "off", emoji: "🎤",
    title: "Micrófono caliente",
    setup: "Un periodista te pregunta si estás a la altura de los grandes del club. La respuesta va a titular en todos lados.",
    options: [
      { label: "\"Vine a ser el mejor de acá\"", risk: 0.4, reward: "big", desc: "Te ponés la vara altísima: la hinchada te ama o te crucifica." },
      { label: "\"Voy paso a paso, con humildad\"", risk: 0.1, reward: "mid", desc: "Nadie se enoja con la humildad." },
      { label: "\"El equipo está por encima de todo\"", risk: 0.15, reward: "mid", desc: "Respuesta de líder de vestuario." },
    ],
  },
  {
    id: "renovacion", type: "off", emoji: "✍️",
    title: "Oferta de renovación",
    setup: "El club te ofrece renovar con una cláusula alta. Tu representante te pide una decisión.",
    options: [
      { label: "Exigir ser el mejor pago del plantel", risk: 0.45, reward: "big", desc: "Si el club banca, ganás respeto y plata. Si no, quedás mal parado." },
      { label: "Renovar en buenos términos", risk: 0.1, reward: "mid", desc: "Todos contentos, relación sólida." },
      { label: "Pedir tiempo para escuchar ofertas", risk: 0.35, reward: "big", desc: "Jugada de poder: puede abrir puertas o enfriar todo." },
    ],
  },
  {
    id: "capitania", type: "off", emoji: "©️",
    title: "La cinta de capitán",
    setup: "El técnico duda entre vos y un referente para la capitanía. Te pregunta en privado qué pensás.",
    options: [
      { label: "\"Estoy listo, déme la cinta\"", risk: 0.35, reward: "big", desc: "Asumís el peso. Si respondés, sos ídolo." },
      { label: "\"Que la lleve el veterano\"", risk: 0.1, reward: "mid", desc: "Gesto de madurez que suma en el vestuario." },
      { label: "\"Decidí usted, yo acompaño\"", risk: 0.15, reward: "mid", desc: "Dejás la pelota en su cancha." },
    ],
  },
];

const REWARD_VALUES = { mid: 0.4, big: 0.7, huge: 1.1 };

// Hitos de carrera: se anuncian al cruzarlos
const MILESTONE_DEFS = [
  { stat: "gls", marks: [50, 100, 200, 300, 400], label: (n) => `⚽ ¡Llegaste a ${n} goles en tu carrera!` },
  { stat: "ast", marks: [50, 100, 200], label: (n) => `🎯 ¡${n} asistencias en tu carrera!` },
  { stat: "pj", marks: [100, 300, 500, 700], label: (n) => `👕 ¡${n} partidos como profesional!` },
  { stat: "caps", marks: [25, 50, 100], label: (n) => `🇦🇷 ¡${n} partidos con la selección!` },
  { stat: "trophies", marks: [5, 10, 20], label: (n) => `🏆 ¡${n} títulos en tu vitrina!` },
];

function crossedMilestones(prev, curr) {
  const out = [];
  MILESTONE_DEFS.forEach((m) => {
    m.marks.forEach((mark) => {
      if (prev[m.stat] < mark && curr[m.stat] >= mark) out.push(m.label(mark));
    });
  });
  return out;
}

// Leyendas por posición para la comparación final
const posGroup = (p) => ["DC", "ED", "EI", "MCO"].includes(p) ? "atk" : ["MC", "MCD", "MD", "MI"].includes(p) ? "mid" : p === "POR" ? "gk" : "def";
const LEGENDS = {
  atk: { name: "Messi", peak: 95, statLabel: "goles", statOf: (s) => s.history.reduce((a, h) => a + h.gls, 0), statRef: 650 },
  mid: { name: "Iniesta", peak: 92, statLabel: "asistencias", statOf: (s) => s.history.reduce((a, h) => a + h.ast, 0), statRef: 280 },
  def: { name: "Maldini", peak: 94, statLabel: "partidos", statOf: (s) => s.history.reduce((a, h) => a + h.pj, 0), statRef: 750 },
  gk: { name: "Neuer", peak: 93, statLabel: "vallas invictas", statOf: (s) => s.history.reduce((a, h) => a + (h.cleanSheets || 0), 0), statRef: 250 },
};

function legacyVerdict(state, peak) {
  const ballons = state.trophies.filter((t) => t.name === "Balón de Oro").length;
  const mundial = state.trophies.some((t) => t.name === "Mundial");
  const leg = LEGENDS[posGroup(state.pos)];
  if (ballons >= 3 || (peak >= 93 && mundial)) return `Estás en la conversación con ${leg.name}. Una carrera irrepetible.`;
  if (peak >= 88 && state.trophies.length >= 3) return "Ídolo continental: tu camiseta se va a retirar.";
  if (peak >= 80) return "Referente de Primera División y de la selección.";
  if (peak >= 70) return "Sólida carrera profesional: vivís del fútbol y con orgullo.";
  return "Guerrero del Ascenso: pocos flashes, mucho barro. Respeto total.";
}

// ---------- SIMULACIÓN DE TEMPORADA ----------

// Riesgo de lesión: sube con la edad y con cada lesión previa (cuerpo castigado).
// El fisio lo reduce un 85%. Exportado para mostrarlo en la carta de pretemporada.
function injuryRisk(state, withFisio) {
  let base = clamp(0.08 + Math.max(state.age - 26, 0) * 0.025 + (state.injuries || 0) * 0.04, 0.08, 0.4);
  // la cláusula médica (pago único) baja el riesgo de base para siempre
  if (state.medicalClause) base *= 0.55;
  return withFisio ? base * 0.15 : base;
}

function playSeason(state, clutchOutcome) {
  const c = club(state.clubId);
  const ovr = state.ovr;
  // hinchada en contra por la indirecta al clásico rival: menos minutos y presión
  const angryPenalty = state.angry ? 0.8 : 1;
  // a un juvenil no se le exige como a un profesional hecho: la vara baja con la edad
  const youth = state.age <= 20;
  const effReq = youth ? c.req - (21 - state.age) * 3 : c.req;
  let fit = clamp(((ovr - effReq) / 15 + 0.6) * angryPenalty, 0.15, 1);
  // los pibes del club van sumando minutos de rotación aunque no les dé el nivel
  if (youth) fit = Math.max(fit, 0.3);
  // ¿Estás peleando el puesto con un juvenil que viene pisando fuerte?
  let duelResult = null;
  if (state.fightingDuel) {
    const winChance = clamp(0.5 + (ovr - effReq) / 30 - Math.max(state.age - 29, 0) * 0.05, 0.15, 0.85);
    if (Math.random() < winChance) {
      duelResult = "won";
      fit = clamp(fit * 1.15, 0.15, 1); // le ganaste el duelo: el DT te ratifica
    } else {
      duelResult = "lost";
      fit = clamp(fit * 0.45, 0.1, 1); // el pibe te pasó por arriba: al banco
    }
  }
  const injured = Math.random() < injuryRisk(state, state.fisio);
  const severeInjury = injured && Math.random() < 0.25; // 1 de 4 lesiones es grave
  // partidos de LIGA según el país (aprox. real): ARG 30, ESP/ITA/ENG 38, GER 34, COL 32
  const leagueGames = LEAGUE_MATCHES[leagueCountry(c.league)] || 34;
  const ligaPj = Math.round(clamp(fit * rf(0.75, 1.1) * (injured ? rf(0.3, 0.55) : 1), 0.1, 1) * leagueGames);

  // ===== COPAS =====
  const country = leagueCountry(c.league);
  const playShare = leagueGames > 0 ? ligaPj / leagueGames : 0; // qué tan titular sos (0-1)
  // Copa nacional: la juegan todos. Cuántos partidos jugás depende de qué tan lejos llega tu club.
  const nationalCupName = NATIONAL_CUP[country];
  const cupRun = clamp(0.2 + (c.prestige - 45) / 90 + rf(-0.15, 0.2), 0.1, 1); // qué tan lejos llega el club
  const cupPj = Math.round(cupRun * 7 * playShare); // hasta ~7 partidos si llega a la final
  const wonNationalCup = Math.random() < clamp((c.prestige - 55) / 120 + 0.06, 0.02, 0.28) && playShare > 0.4;
  // Torneo internacional (Libertadores/Champions): solo si tu club es lo bastante grande.
  const intlCupName = INTL_CUP[country];
  const inIntlCup = c.prestige >= 68; // clasificaste el año pasado
  const intlRun = inIntlCup ? clamp(0.3 + (c.prestige - 68) / 60 + rf(-0.2, 0.25), 0.1, 1) : 0;
  const intlPj = Math.round(intlRun * 13 * playShare); // liguilla + eliminatorias, hasta ~13
  const wonIntlCup = inIntlCup && Math.random() < clamp((c.prestige - 80) / 200 + 0.02, 0.01, 0.14) && playShare > 0.5;

  const pj = ligaPj + cupPj + intlPj;
  const isAtk = ["DC", "ED", "EI", "MCO"].includes(state.pos);
  const isMid = ["MC", "MCD", "MD", "MI"].includes(state.pos);
  const gls = state.pos === "POR" ? 0 : Math.round(pj * (isAtk ? rf(0.25, 0.65) : isMid ? rf(0.08, 0.2) : rf(0.01, 0.06)) * (ovr / 80));
  const ast = state.pos === "POR" ? 0 : Math.round(pj * (isAtk ? rf(0.1, 0.3) : isMid ? rf(0.15, 0.35) : rf(0.02, 0.1)) * (ovr / 80));
  // vallas invictas: solo arqueros. Un arquero mejor mantiene el cero más seguido.
  const cleanSheets = state.pos === "POR" ? Math.round(pj * clamp((ovr - 45) / 90, 0.05, 0.5)) : 0;
  const g = posGroup(state.pos);
  // el delantero es volátil: si no hace goles, rinde mal aunque juegue bien
  let rating;
  const starter = playShare > 0.6; // titular si jugaste 60%+ de la liga
  if (g === "atk") {
    const golesPorPartido = pj > 0 ? gls / pj : 0;
    rating = clamp(rf(4.9, 6.6) + golesPorPartido * 2.2 + (ovr - effReq) / 35 + (starter ? 0.2 : -0.3) - (state.angry ? 0.5 : 0), 4.5, 9.8);
  } else if (g === "gk") {
    // el arquero es parejo: pocas temporadas brillantes, pocas desastrosas
    rating = clamp(rf(5.8, 7.1) + (ovr - effReq) / 35 + (starter ? 0.2 : -0.4) - (state.angry ? 0.4 : 0), 4.8, 9.2);
  } else {
    rating = clamp(rf(5.4, 7.4) + (ovr - effReq) / 30 + (starter ? 0.3 : -0.3) - (state.angry ? 0.5 : 0), 4.5, 9.8);
  }

  // El momento decisivo suma o resta al rating de la temporada según cómo te fue.
  if (clutchOutcome) rating = clamp(rating + clutchOutcome.ratingDelta, 4.2, 10);

  // ¿Tu club sale campeón? Se compara con los demás de SU liga (no de todo el mundo)
  const leaguePeers = CLUBS.filter((x) => x.league === c.league);
  const leagueMax = Math.max(...leaguePeers.map((x) => x.prestige));
  // solo los que pelean arriba tienen chance real; el gap con el mejor manda
  let titleChance = clamp(0.30 - (leagueMax - c.prestige) / 40, 0.01, 0.40);
  // un momento decisivo ganado en la cancha puede empujar el título
  if (clutchOutcome?.titleBoost) titleChance = clamp(titleChance + clutchOutcome.titleBoost, 0.01, 0.75);
  const champion = Math.random() < titleChance;

  const prestigeBoost = 0.6 + (c.prestige / 100) * 0.9;
  const minutesBoost = 0.5 + fit * 0.6;
  let base = ageDelta(state.age, state.pos);
  if (base < 0 && state.fisio) base *= 0.4;
  let growth = base * prestigeBoost * minutesBoost;
  if (state.trainerBoost) growth = growth > 0 ? growth * 1.4 : growth + 1;
  if (rating >= 7.5) growth += 0.6;
  // techo blando: cada punto cuesta más cuanto más arriba estás.
  // Pasar de 60 a 70 es una buena carrera; de 85 a 92 es cosa de elegidos.
  if (growth > 0) {
    const ceiling = clamp(1 - (ovr - 55) / 48, 0.1, 1);
    growth *= ceiling;
  }
  if (injured) growth -= severeInjury ? 3 : 1; // una lesión grave te marca el físico
  const newOvr = clamp(Math.round((ovr + growth) * 10) / 10, 40, 99);

  return { pj, ligaPj, cupPj, intlPj, gls, ast, cleanSheets, rating: Math.round(rating * 10) / 10, newOvr, injured, severeInjury, champion,
    nationalCupName, wonNationalCup, intlCupName, inIntlCup, wonIntlCup, duelResult };
}

// Selección nacional: te convocan si tu nivel da (más fácil con buen rating).
// Cada 2 temporadas hay torneo: alterna Copa América y Mundial.
function playNationalTeam(state, seasonRating) {
  // la prensa/fama te pone en la consideración del DT: baja un poco la vara para ser convocado
  const ovrReq = state.press ? 70 : 73;
  const ratingReq = state.press ? 6.0 : 6.3;
  const convocado = state.ovr >= ovrReq && seasonRating >= ratingReq && state.age >= 18;
  if (!convocado) return null;
  const isAtk = ["DC", "ED", "EI", "MCO"].includes(state.pos);
  const caps = Math.round(rf(4, 9));
  const goals = state.pos === "POR" ? 0 : Math.round(caps * (isAtk ? rf(0.3, 0.7) : rf(0.05, 0.25)));
  let torneo = null;
  if (state.age % 2 === 0) {
    const name = state.age % 4 === 0 ? "Mundial" : "Copa América";
    const winChance = clamp(0.15 + (state.ovr - 75) / 80, 0.1, 0.5);
    torneo = { name, won: Math.random() < winChance };
  }
  return { caps, goals, torneo };
}

// Ofertas del mercado. Si te soltaron (forced), también ofertan clubes
// más chicos y garantizamos al menos una salida.
function generateOffers(state, seasonRating, forced) {
  const current = club(state.clubId);
  const offers = [];
  CLUBS.forEach((c) => {
    if (c.id === state.clubId) return;
    if ((state.blockedClubs || {})[c.id] > 0) return; // te soltaron: están resentidos
    if (!forced && c.tier < current.tier) return;
    if (state.ovr < c.req - (forced ? 10 : 3)) return;
    const hinted = state.hintedClub === c.id;
    const reaction = state.hintReaction?.clubId === c.id ? state.hintReaction.type : null;
    // ¿Este club necesita un jugador de tu posición este mercado? A veces simplemente no.
    // La indirecta ayuda a que te tengan en cuenta, pero no crea la necesidad.
    const needsYourPos = Math.random() < (hinted ? 0.65 : 0.45);
    let chance = 0.1 + (state.ovr - c.req) * 0.02 + (seasonRating - 6.5) * 0.15;
    // el peso de la indirecta depende de cómo reaccionó el club a tu nivel
    if (reaction === "interesado") chance += 0.5;
    else if (reaction === "tibio") chance += 0.18;
    else if (reaction === "desmentido") chance -= 0.3; // salieron a decir que no te quieren
    if (state.agent) chance += 0.12;
    // memoria: si dejaste una buena relación en este club, hay más chance de que te vuelvan a llamar
    const bond = (state.clubBonds || {})[c.id] || 0;
    if (bond > 0) chance += bond * 0.12; // hasta +0.36 con relación máxima
    // los clubes grandes (prestige alto) desconfían de un jugador muy propenso a lesiones.
    // La cláusula médica los tranquiliza y evita esa penalización.
    if ((state.injuries || 0) >= 3 && c.prestige >= 75 && !state.medicalClause) {
      chance -= 0.25 + ((state.injuries || 0) - 3) * 0.05; // cuantas más lesiones, más recelo
    }
    if (forced && c.tier <= current.tier) chance += 0.3; // los chicos te ven accesible
    if (!needsYourPos && !forced) chance *= 0.15; // no buscan tu puesto: casi imposible
    if (Math.random() < clamp(chance, 0.02, 0.9)) {
      const wage = Math.round(marketValue(state.ovr, state.age, state.pos) * rf(0.08, 0.12) * (forced ? 0.8 : 1));
      offers.push({ clubId: c.id, wage, negotiated: false, returning: bond > 0 });
    }
  });
  // Selección con variedad: mezclamos y priorizamos, pero sin quedarnos SIEMPRE con los 2 de
  // más prestigio. Así el mercado se siente distinto cada temporada.
  const shuffled = offers.sort(() => Math.random() - 0.5);
  // los clubes con los que tenés relación previa tienen prioridad de aparecer (memoria)
  shuffled.sort((a, b) => (b.returning ? 1 : 0) - (a.returning ? 1 : 0));
  const sorted = shuffled.slice(0, forced ? 3 : 2);
  // red de seguridad: si te soltaron y nadie ofertó, un club humilde te levanta
  if (forced && sorted.length === 0) {
    const fallback = [...CLUBS].filter((c) => c.id !== state.clubId && !((state.blockedClubs || {})[c.id] > 0) && state.ovr >= c.req - 12)
      .sort((a, b) => a.prestige - b.prestige)[0] || CLUBS[0];
    sorted.push({ clubId: fallback.id, wage: Math.round(marketValue(state.ovr, state.age, state.pos) * 0.06), negotiated: false });
  }
  return sorted;
}

// ============================================================

export default function App() {
  const [screen, setScreen] = useState("identidad"); // identidad | posicion | cantera | mercado | pretemporada | fin
  const [apellido, setApellido] = useState(() => loadPref("apellido", ""));
  const [numero, setNumero] = useState(() => loadPref("numero", "10"));
  const [pierna, setPierna] = useState(() => loadPref("pierna", "Derecha"));
  const [pos, setPos] = useState(() => loadPref("pos", null));

  const [state, setState] = useState(null);
  const [lastSeason, setLastSeason] = useState(null);
  const [offers, setOffers] = useState([]);
  const [released, setReleased] = useState(false);
  const [negMsg, setNegMsg] = useState(null);
  const [pendingHint, setPendingHint] = useState(null); // indirecta elegida (opcional) antes de la acción
  const [postDiario, setPostDiario] = useState(null); // pantalla que sigue después de la tapa del diario
  const [diarioKind, setDiarioKind] = useState("normal");
  const [celebration, setCelebration] = useState(null); // { title, subtitle, emoji } o null
  const [cantera, setCantera] = useState([]); // 3 clubes random que te ofrecen la cantera
  const [clutch, setClutch] = useState(null); // momento decisivo pendiente { moment, pendingState }
  const [clutchResult, setClutchResult] = useState(null); // resultado del momento para mostrar

  // Toda temporada termina en la tapa del diario; después se sigue a la pantalla que corresponda.
  // Si hubo un logro grande, primero mostramos una pantalla de festejo.
  function goDiario(nextScreen, kind, party) {
    setPostDiario(nextScreen);
    setDiarioKind(kind);
    if (party) {
      buzz([40, 60, 40, 60, 120]); // patrón de vibración festivo
      setCelebration(party);
      setScreen("festejo");
    } else {
      setScreen("diario");
    }
  }

  // Vibración en dispositivos que la soporten (móviles). Silencioso si no.
  function buzz(pattern) {
    try { if (navigator.vibrate) navigator.vibrate(pattern); } catch (e) {}
  }

  // Vibración corta y seca cuando el resultado de la temporada trae una lesión
  useEffect(() => {
    if (lastSeason?.injured) buzz(lastSeason.severeInjury ? [90, 50, 90] : [70]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastSeason]);

  // ---------- FLUJO ----------

  function confirmIdentity() {
    if (!pos) return;
    // recordar identidad para la próxima carrera
    savePref("apellido", apellido.trim().toUpperCase() || "JUGADOR");
    savePref("numero", numero);
    savePref("pierna", pierna);
    savePref("pos", pos);
    setState({
      apellido: apellido.trim().toUpperCase() || "JUGADOR",
      numero, pierna, pos,
      age: START_AGE, ovr: 50, clubId: null, hintedClub: null,
      money: 0, wage: 20000, agent: false, trainerBoost: false, fisio: false, press: false, medicalClause: false,
      caps: 0, capGoals: 0, trophies: [], angry: false,
      parentClubId: null, loanYearsLeft: 0,
      duelPending: false, duelOfferClub: null, fightingDuel: false,
      hintCooldown: 0,
      badStreak: 0, blockedClubs: {},
      injuries: 0, formative: [], idolo: false, homecomingDone: false, homeOffer: null,
      clubBonds: {},
      clutchCooldown: 1,
      history: [],
    });
    setCantera(pickCantera());
    setScreen("cantera");
  }

  function signCantera(clubId) {
    const s = { ...state, clubId };
    setState(s);
    runSeason(s);
  }

  // Simula la temporada y decide qué pantalla sigue
  // El jugador eligió una opción del momento decisivo. Mitad OVR, mitad suerte.
  function chooseClutch(option) {
    const s = clutch.pendingState;
    const moment = clutch.moment;
    // probabilidad de éxito: 50% viene de tu nivel, 50% de la suerte, menos la dificultad de la opción
    const skill = clamp((s.ovr - 55) / 45, 0, 1); // 0 a 1 según OVR
    const successChance = clamp(0.5 * skill + 0.5 * Math.random() - option.risk * 0.4 + 0.35, 0.05, 0.95);
    const success = Math.random() < successChance;
    const rewardVal = REWARD_VALUES[option.reward];

    // Traducimos el resultado a modificadores de la temporada
    let ratingDelta, titleBoost = 0, moneyDelta = 0, bondDelta = 0;
    if (success) {
      ratingDelta = rewardVal;                       // sube tu rendimiento del año
      if (moment.type === "pitch") titleBoost = rewardVal * 0.12; // en la cancha, empuja el título
      if (moment.id === "renovacion") moneyDelta = Math.round(s.wage * 0.5); // conseguiste mejor contrato
      bondDelta = 1;                                  // quedás bien parado
    } else {
      ratingDelta = -rewardVal * 0.7;                 // fallar duele, pero menos de lo que sumaba
      bondDelta = moment.type === "off" ? -1 : 0;     // meter la pata fuera de la cancha te deja mal
    }

    // aplicamos plata/relación al estado; el rating/título van al resolver de la temporada
    let s2 = { ...s, clutchCooldown: 2 };
    if (moneyDelta) s2 = { ...s2, money: s2.money + moneyDelta };
    if (bondDelta && s2.clubId) {
      const bonds = { ...(s2.clubBonds || {}) };
      bonds[s2.clubId] = clamp((bonds[s2.clubId] || 0) + bondDelta, 0, 3);
      s2 = { ...s2, clubBonds: bonds };
    }

    setClutchResult({
      moment, option, success,
      text: success ? clutchSuccessText(moment, option) : clutchFailText(moment, option),
      resolved: { state: s2, outcome: { ratingDelta, titleBoost } },
    });
    setClutch(null);
    setScreen("clutchResult");
  }

  // Textos de resultado del momento decisivo
  function clutchSuccessText(moment, option) {
    if (moment.type === "pitch") return "¡Saliste airoso! La jugada terminó como soñabas y el estadio explotó. Vas a ser noticia.";
    return "Tu postura cayó perfecto. Ganaste autoridad y todos hablan bien de vos.";
  }
  function clutchFailText(moment, option) {
    if (moment.type === "pitch") return "No salió. La jugada se te escapó en el peor momento y quedaste señalado.";
    return "La movida te salió mal. Hubo ruido y quedaste un poco expuesto.";
  }

  function continueFromClutch() {
    const resolved = clutchResult?.resolved;
    setClutchResult(null);
    setClutch(null);
    if (resolved) resolveSeason(resolved.state, resolved.outcome);
  }

  function runSeason(s) {
    // ¿Se dispara un momento decisivo? Cada par de temporadas como mucho, y solo si ya
    // sos parte del equipo (no en tu primer año ni de muy pibe). Mitad del tiempo, para que sea especial.
    const clutchReady = (s.clutchCooldown || 0) <= 0 && s.age >= 19 && s.history.length >= 1 && !s.parentClubId;
    if (clutchReady && Math.random() < 0.5) {
      const moment = CLUTCH_MOMENTS[Math.floor(Math.random() * CLUTCH_MOMENTS.length)];
      setClutch({ moment, pendingState: s });
      setScreen("clutch");
      return;
    }
    resolveSeason(s, null);
  }

  // Resuelve la temporada. clutchOutcome puede traer un modificador del momento decisivo.
  function resolveSeason(s, clutchOutcome) {
    const season = playSeason(s, clutchOutcome);
    const natl = playNationalTeam(s, season.rating);
    const newTrophies = [];
    let prize = 0;
    if (season.champion) {
      newTrophies.push({ name: club(s.clubId).league, clubId: s.clubId, age: s.age });
      prize += Math.round(s.wage * 0.5); // premio por salir campeón
    }
    if (natl?.torneo?.won) {
      newTrophies.push({ name: natl.torneo.name, clubId: null, age: s.age });
      prize += Math.round(s.wage * 0.4);
    }
    if (season.wonNationalCup) {
      newTrophies.push({ name: season.nationalCupName, clubId: s.clubId, age: s.age });
      prize += Math.round(s.wage * 0.35);
    }
    if (season.wonIntlCup) {
      newTrophies.push({ name: season.intlCupName, clubId: s.clubId, age: s.age });
      prize += Math.round(s.wage * 0.8); // el torneo internacional paga como ninguno
    }
    // Balón de Oro: solo para los mejores del mundo en un año brillante.
    // Una campaña de prensa te da visibilidad y empuja tu candidatura.
    const ballonChance = clamp((s.ovr - 86) / 18 + (s.press ? 0.2 : 0), 0.05, 0.85);
    const ballon = s.ovr >= 88 && season.rating >= 7.6 && Math.random() < ballonChance;
    if (ballon) {
      newTrophies.push({ name: "Balón de Oro", clubId: null, age: s.age });
      prize += Math.round(s.wage * 0.6);
    }

    // ¿Hubo un logro grande para festejar? Se calcula una sola vez y se pasa a cualquier
    // camino que siga (mercado, préstamo, retiro, etc.) para que el festejo nunca se pierda.
    const playerName = s.apellido;
    let party = null;
    if (ballon) {
      party = { title: "BALÓN DE ORO", subtitle: `${playerName} es el mejor jugador del mundo`, emoji: "✨" };
    } else if (season.wonIntlCup) {
      party = { title: `¡${season.intlCupName.toUpperCase()}!`, subtitle: `${club(s.clubId).name} campeón de ${season.intlCupName} con ${playerName}`, emoji: "🌎" };
    } else if (natl?.torneo?.won && natl.torneo.name === "Mundial") {
      party = { title: "¡CAMPEÓN DEL MUNDO!", subtitle: `${playerName} y la Selección tocan la gloria`, emoji: "🏆" };
    } else if (natl?.torneo?.won) {
      party = { title: "¡CAMPEÓN DE AMÉRICA!", subtitle: `${playerName} levanta la Copa con la Selección`, emoji: "🏆" };
    } else if (season.champion) {
      party = { title: "¡CAMPEONES!", subtitle: `${club(s.clubId).name} da la vuelta con ${playerName}`, emoji: "🏆" };
    }
    const seasonWithAge = { ...season, age: s.age };
    const bad = isBadSeason(seasonWithAge);
    // si sos ídolo del club de tus amores, la hinchada no deja que te suelten
    const isHome = s.idolo && s.formative.includes(s.clubId);
    const releasedNow = !s.parentClubId && !isHome && isReleased(seasonWithAge, s.badStreak);
    const entry = {
      age: s.age, clubId: s.clubId, ovr: Math.round(season.newOvr),
      pj: season.pj, ligaPj: season.ligaPj, cupPj: season.cupPj, intlPj: season.intlPj, gls: season.gls, ast: season.ast, cleanSheets: season.cleanSheets, rating: season.rating, injured: season.injured,
      role: season.ligaPj >= 24 ? "Titular" : season.ligaPj >= 12 ? "Rotación" : "Suplente",
      duelResult: season.duelResult,
      champion: season.champion, natl, wasAngry: s.angry, ballon,
      onLoan: !!s.parentClubId, parentClubId: s.parentClubId,
      severeInjury: season.severeInjury,
      warning: bad && !releasedNow && !s.parentClubId && !isHome, // te bancan, pero avisan
      hintReaction: s.hintReaction || null, // reacción del club a la indirecta que tiraste
      wonNationalCup: season.wonNationalCup, nationalCupName: season.nationalCupName,
      wonIntlCup: season.wonIntlCup, intlCupName: season.intlCupName,
    };
    // los clubes resentidos se van olvidando de a poco
    const cooledBlocked = {};
    Object.entries(s.blockedClubs || {}).forEach(([id, n]) => { if (n - 1 > 0) cooledBlocked[id] = n - 1; });
    // los clubes donde jugaste de pibe (hasta los 20) te formaron
    const formative = s.age <= 20 && !s.formative.includes(s.clubId) ? [...s.formative, s.clubId] : s.formative;
    // relación con los clubes: una buena temporada te deja bien parado ahí para el futuro.
    // Cada club acumula "cariño" (tope 3). Una mala temporada lo baja un poco.
    const clubBonds = { ...(s.clubBonds || {}) };
    if (s.clubId && !s.parentClubId) {
      const cur = clubBonds[s.clubId] || 0;
      if (season.rating >= 6.8) clubBonds[s.clubId] = clamp(cur + 1, 0, 3);
      else if (season.rating < 5.6) clubBonds[s.clubId] = clamp(cur - 1, 0, 3);
    }
    const next = {
      ...s,
      age: s.age + 1,
      ovr: season.newOvr,
      badStreak: bad ? s.badStreak + 1 : 0,
      blockedClubs: cooledBlocked,
      injuries: s.injuries + (season.injured ? 1 : 0),
      formative,
      clubBonds,
      money: s.money + s.wage + prize,
      caps: s.caps + (natl?.caps || 0),
      capGoals: s.capGoals + (natl?.goals || 0),
      trophies: [...s.trophies, ...newTrophies],
      hintedClub: null,
      hintReaction: null,
      trainerBoost: false,
      fisio: false,
      press: false,
      angry: false, // la bronca de la hinchada dura una temporada
      fightingDuel: false,
      hintCooldown: Math.max((s.hintCooldown || 0) - 1, 0),
      clutchCooldown: Math.max((s.clutchCooldown || 0) - 1, 0),
      history: [...s.history, entry],
    };
    // ¿Cruzaste algún hito histórico esta temporada?
    const sum = (hist, k) => hist.reduce((a, h) => a + (h[k] || 0), 0);
    const prevTotals = { gls: sum(s.history, "gls"), ast: sum(s.history, "ast"), pj: sum(s.history, "pj"), caps: s.caps, trophies: s.trophies.length };
    const currTotals = { gls: prevTotals.gls + season.gls, ast: prevTotals.ast + season.ast, pj: prevTotals.pj + season.pj, caps: next.caps, trophies: next.trophies.length };
    entry.milestones = crossedMilestones(prevTotals, currTotals);

    setLastSeason(entry);

    if (next.age >= RETIRE_AGE) { setState(next); goDiario("fin", "fin", party); return; }

    // --- Estás a préstamo: no hay mercado hasta que termine ---
    if (next.parentClubId) {
      next.loanYearsLeft = s.loanYearsLeft - 1;
      setState(next);
      goDiario(next.loanYearsLeft <= 0 ? "finPrestamo" : "pretemporada", "loanSeason", party);
      return;
    }

    // --- Sos joven en un grande y rendiste mal: a préstamo sin vueltas ---
    if (bad && shouldLoan(s, entry)) {
      setState({ ...next, badStreak: 0 });
      goDiario("prestamo", "prestamo", party);
      return;
    }

    // --- Rendiste mal dos veces seguidas (o una desastrosa) ---
    if (releasedNow) {
      // el club que te suelta queda resentido 3 temporadas
      const withBlock = { ...next, badStreak: 0, blockedClubs: { ...next.blockedClubs, [s.clubId]: 3 } };
      setState(withBlock);
      setReleased(true);
      setOffers(generateOffers(withBlock, season.rating, true));
      setNegMsg(null);
      goDiario("mercado", "released", party);
      return;
    }

    // --- Duelo generacional: sos veterano, no brillás, y un pibe viene por tu puesto ---
    if (next.age >= 29 && !next.parentClubId && season.rating < 6.5 && !bad && Math.random() < 0.35) {
      const escape = CLUBS.filter((c) => c.id !== next.clubId && c.tier <= club(next.clubId).tier
        && !((next.blockedClubs || {})[c.id] > 0) && next.ovr >= c.req - 6)
        .sort((a, b) => b.prestige - a.prestige)[0];
      if (escape) {
        setState({ ...next, duelPending: true, duelOfferClub: escape.id });
        goDiario("duelo", "duelo", party);
        return;
      }
    }

    // --- La vuelta a casa: sos un jugador de renombre y el club que te formó te llama ---
    if (!next.homecomingDone && next.age >= 29 && next.ovr >= 78) {
      const home = next.formative.filter((id) => id !== next.clubId).map(club)
        .sort((a, b) => b.prestige - a.prestige)[0];
      if (home && Math.random() < 0.5) {
        setState({ ...next, homeOffer: home.id });
        goDiario("vuelta", "vuelta", party);
        return;
      }
    }

    setState(next);
    setReleased(false);
    setOffers(generateOffers(next, season.rating, false));
    setNegMsg(null);
    goDiario("mercado", "normal", party);
  }

  // Duelo generacional: pelear el puesto o irte al club que te llama
  function answerDuel(fight) {
    if (fight) {
      setState((s) => ({ ...s, duelPending: false, duelOfferClub: null, fightingDuel: true }));
    } else {
      const c = club(state.duelOfferClub);
      setState((s) => ({
        ...s,
        clubId: c.id,
        wage: Math.round(marketValue(s.ovr, s.age, s.pos) * 0.08),
        duelPending: false, duelOfferClub: null, badStreak: 0,
      }));
    }
    setScreen("pretemporada");
  }

  // Respuesta al llamado del club de tus amores
  function answerHome(accept) {
    const home = club(state.homeOffer);
    if (accept) {
      setState((s) => ({
        ...s,
        clubId: home.id,
        wage: Math.round(s.wage * 0.6), // volvés por amor, no por plata
        idolo: true,
        homecomingDone: true,
        homeOffer: null,
        badStreak: 0,
      }));
    } else {
      // te pueden volver a llamar más adelante
      setState((s) => ({ ...s, homeOffer: null }));
    }
    setScreen(accept ? "pretemporada" : "mercado");
    if (!accept) {
      setReleased(false);
      setOffers(generateOffers(state, lastSeason?.rating || 6.5, false));
      setNegMsg(null);
    }
  }

  // Elegís a qué club irte a préstamo (1 o 2 temporadas, al azar)
  function chooseLoan(loanClub) {
    const years = Math.random() < 0.6 ? 1 : 2;
    setState((s) => ({ ...s, parentClubId: s.clubId, clubId: loanClub.id, loanYearsLeft: years }));
    setScreen("pretemporada");
  }

  // Fin del préstamo: volvés al club dueño de tu pase o fichás donde estabas
  function endLoan(stay) {
    setState((s) => {
      if (stay) {
        // el club del préstamo te compra: sueldo nuevo acorde
        return { ...s, parentClubId: null, loanYearsLeft: 0, wage: Math.round(marketValue(s.ovr, s.age, s.pos) * 0.09) };
      }
      return { ...s, clubId: s.parentClubId, parentClubId: null, loanYearsLeft: 0 };
    });
    setScreen("pretemporada");
  }

  // MERCADO: elegir club (o quedarse, si no te soltaron)
  function chooseClub(offer) {
    const next = offer ? { ...state, clubId: offer.clubId, wage: offer.wage, badStreak: 0 } : state;
    setState(next);
    setOffers([]);
    setScreen("pretemporada");
  }

  // Riesgo de que el club retire la oferta si seguís negociando (crece con cada intento).
  // Se usa tanto en la lógica como para colorear el botón.
  function withdrawRiskFor(offer) {
    const rounds = offer.negotiations || 0;
    if (released && offers.length <= 1) return 0; // tu única salida forzada nunca se retira
    return clamp(0.1 + rounds * 0.18 - (state.agent ? 0.1 : 0), 0, 0.7);
  }

  function negotiate(offer, idx) {
    const c = club(offer.clubId);
    const rounds = offer.negotiations || 0; // cuántas veces ya negociaste esta oferta
    // cada ronda extra baja la chance de éxito y sube la de que se enojen
    let chance = clamp(0.55 + (state.ovr - c.req) / 60 - rounds * 0.18, 0.1, 0.85);
    if (state.agent) chance = clamp(chance + 0.15, 0, 0.92);
    // riesgo de que retiren la oferta: crece con cada intento (nunca en tu única salida forzada)
    const withdrawRisk = withdrawRiskFor(offer);

    if (Math.random() < withdrawRisk) {
      setOffers((prev) => prev.filter((_, i) => i !== idx));
      setNegMsg({ text: `${c.name} se cansó de tus pedidos y retiró la oferta.`, ok: false });
      return;
    }
    if (Math.random() < chance) {
      setOffers((prev) => prev.map((o, i) => (i === idx ? { ...o, wage: Math.round(o.wage * 1.2), negotiations: rounds + 1 } : o)));
      setNegMsg({ text: `${c.name} mejoró la oferta un 20%. ${rounds >= 1 ? "Pero cada vez se ponen más tensos…" : "¿Seguís apretando?"}`, ok: true });
    } else {
      setOffers((prev) => prev.map((o, i) => (i === idx ? { ...o, negotiations: rounds + 1 } : o)));
      setNegMsg({ text: `${c.name} no cede esta vez. Cuidado: si insistís mucho pueden retirarse.`, ok: false });
    }
  }

  // PRETEMPORADA: invertir y jugar
  function invest(decision) {
    const hint = pendingHint; // la indirecta viene aparte, no gasta la acción
    const hintIsRival = hint && RIVALS[state.clubId] === hint;
    let s = { ...state, hintedClub: hint || null, angry: hintIsRival };
    if (hint) {
      s = { ...s, hintCooldown: Math.random() < 0.5 ? 3 : 4 }; // reutilizable cada 3-4 años
      // Reacción del club según cuánto le sobrás a su nivel requerido:
      // les sobrás -> interesados | justo -> tibios | muy por debajo -> te desmienten en público
      const target = club(hint);
      const gap = state.ovr - target.req;
      let reaction;
      if (gap >= 3) reaction = "interesado";
      else if (gap >= -5) reaction = "tibio";
      else reaction = "desmentido";
      s = { ...s, hintReaction: { clubId: hint, type: reaction } };
      // el desmentido de un club grande al que apuntaste muy alto molesta a tu hinchada actual
      if (reaction === "desmentido") s = { ...s, blockedClubs: { ...s.blockedClubs, [hint]: 2 } };
    } else {
      s = { ...s, hintReaction: null };
    }
    if (decision.trainer) { s = { ...s, money: s.money - trainerCost(s), trainerBoost: true }; }
    if (decision.fisio) { s = { ...s, money: s.money - fisioCost(s), fisio: true }; }
    if (decision.agent) { s = { ...s, money: s.money - agentCost(s), agent: true }; }
    if (decision.press) { s = { ...s, money: s.money - pressCost(s), press: true }; }
    if (decision.clause) { s = { ...s, money: s.money - clauseCost(s), medicalClause: true }; }
    setPendingHint(null);
    setState(s);
    runSeason(s);
  }

  // clubes alcanzables para indirecta: tu nivel o un poco por encima, sin filtrar cantidad
  // (el buscador de abajo se encarga de que no abrume)
  const hintTargets = state && state.clubId
    ? CLUBS.filter((c) => c.id !== state.clubId && c.tier >= club(state.clubId).tier && state.ovr >= c.req - 8)
        .sort((a, b) => b.prestige - a.prestige)
    : [];

  // ---------- ESTILOS ----------

  const S = {
    // shell estable: mismo ancho y respiración en todas las pantallas, con safe-area para el notch
    page: "min-h-screen bg-black text-white font-sans flex flex-col items-center px-4 pt-6 pb-10",
    card: "w-full max-w-md mx-auto",
    h1: "text-3xl font-bold mb-4",
    label: "text-[11px] uppercase tracking-widest text-neutral-500 mb-1 block text-center",
    input: "w-full bg-neutral-900 rounded-xl px-4 py-3.5 text-center text-lg outline-none focus:ring-1 ring-white/40",
    btnPrimary: "bg-white text-black font-semibold rounded-full px-6 py-4 w-full disabled:opacity-30 transition active:scale-[0.97] text-base",
    btnGhost: "border border-neutral-700 text-white rounded-full px-6 py-4 w-full transition active:scale-[0.97] text-base",
    pill: "rounded-full px-4 py-2.5 text-sm font-semibold transition active:scale-95",
  };

  // ---------- PANTALLAS ----------

  if (screen === "identidad") {
    return (
      <div className={S.page}>
        <div className={S.card}>
          <Logo />
          <h1 className={S.h1}>Identidad</h1>
          <Progress value={33} />
          <div className="bg-neutral-950 rounded-2xl p-5 mt-5 space-y-4">
            <div>
              <span className={S.label}>Apellido</span>
              <input className={S.input} value={apellido} onChange={(e) => setApellido(e.target.value.toUpperCase())} placeholder="Tu apellido" maxLength={14} style={{ textTransform: "uppercase" }} />
            </div>
            <div>
              <span className={S.label}>Número</span>
              <input className={S.input} value={numero} onChange={(e) => setNumero(e.target.value.replace(/\D/g, "").slice(0, 2))} />
            </div>
            <div>
              <span className={S.label}>Pierna hábil</span>
              <div className="flex bg-neutral-900 rounded-full p-1">
                {["Izquierda", "Derecha"].map((p) => (
                  <button key={p} onClick={() => setPierna(p)}
                    className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition ${pierna === p ? "bg-white text-black" : "text-neutral-400"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button className={`${S.btnPrimary} mt-6`} onClick={() => setScreen("posicion")}>Continuar</button>
          <Footer />
        </div>
      </div>
    );
  }

  if (screen === "posicion") {
    const layout = [
      ["EI", "DC", "ED"], [null, "MCO", null], ["MI", "MC", "MD"],
      [null, "MCD", null], ["LI", "DFC", "LD"], [null, "POR", null],
    ];
    return (
      <div className={S.page}>
        <div className={S.card}>
          <Logo />
          <h1 className={S.h1}>Posición</h1>
          <Progress value={66} />
          <div className="mt-5 rounded-2xl border border-white/20 overflow-hidden relative">
            {/* Cancha de fútbol dibujada de fondo */}
            <svg viewBox="0 0 300 500" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" aria-hidden="true">
              <defs>
                <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0f5132" />
                  <stop offset="100%" stopColor="#0a3d26" />
                </linearGradient>
              </defs>
              {/* césped con franjas */}
              <rect width="300" height="500" fill="url(#grass)" />
              {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
                <rect key={n} x="0" y={n * 62.5} width="300" height="62.5" fill={n % 2 === 0 ? "#ffffff" : "#000000"} opacity="0.04" />
              ))}
              {/* líneas del campo */}
              <g fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.5">
                <rect x="10" y="10" width="280" height="480" />
                <line x1="10" y1="250" x2="290" y2="250" />
                <circle cx="150" cy="250" r="45" />
                <circle cx="150" cy="250" r="2.5" fill="#ffffff" />
                {/* área superior */}
                <rect x="75" y="10" width="150" height="65" />
                <rect x="115" y="10" width="70" height="28" />
                {/* área inferior */}
                <rect x="75" y="425" width="150" height="65" />
                <rect x="115" y="462" width="70" height="28" />
              </g>
            </svg>
            {/* Botones de posición encima de la cancha */}
            <div className="relative p-4">
              {layout.map((row, i) => (
                <div key={i} className="flex justify-around my-3">
                  {row.map((p, j) =>
                    p ? (
                      <button key={p} onClick={() => setPos(p)}
                        className={`${S.pill} ${pos === p ? "bg-white text-black shadow-lg shadow-white/40 scale-110" : "bg-black/50 text-white backdrop-blur-sm border border-white/20"}`}>
                        {p}
                      </button>
                    ) : <span key={j} className="px-4" />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className={`${S.btnGhost} flex-1`} onClick={() => setScreen("identidad")}>Volver</button>
            <button className={`${S.btnPrimary} flex-1`} disabled={!pos} onClick={confirmIdentity}>Confirmar identidad</button>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  if (!state) return null;

  const Header = () => (
    <div className="flex items-center gap-3 bg-neutral-950 rounded-2xl p-4 mb-4">
      <div className={`bg-gradient-to-b ${ovrTier(state.ovr).grad} rounded-xl w-16 h-16 flex flex-col items-center justify-center shrink-0`}>
        <span className={`text-[9px] uppercase tracking-wide ${ovrTier(state.ovr).text} opacity-80`}>OVR</span>
        <span className={`text-2xl font-black ${ovrTier(state.ovr).text}`}>{Math.round(state.ovr)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <span className="bg-emerald-900 text-emerald-200 text-xs font-semibold rounded-md px-2 py-0.5">#{state.numero} {state.pos}</span>
        <p className="font-bold text-lg truncate mt-1 flex items-center gap-1.5">
          {state.clubId && <ClubLogo id={state.clubId} size={20} />}
          <span className="truncate">{state.clubId ? club(state.clubId).name : "Libre"}</span>
        </p>
        <p className="text-xs text-neutral-500">
          {state.parentClubId ? `A préstamo de ${club(state.parentClubId).name}` : state.clubId ? club(state.clubId).league : "Sin club"}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs text-neutral-500">EDAD <span className="text-white font-bold text-base">{state.age}</span></p>
        <p className="text-xs text-neutral-500">VALOR <span className="text-white font-bold text-base">{fmtMoney(marketValue(state.ovr, state.age, state.pos))}</span></p>
        <p className="text-xs text-neutral-500">BANCO <span className="text-emerald-400 font-bold text-base">{fmtMoney(state.money)}</span></p>
      </div>
    </div>
  );

  const CareerChart = () => {
    const h = state.history;
    if (h.length < 2) return null;
    const w = 320, ht = 56, pad = 6;
    const min = Math.min(...h.map((x) => x.ovr)) - 3;
    const max = Math.max(...h.map((x) => x.ovr)) + 3;
    const X = (i) => pad + (i / (h.length - 1)) * (w - pad * 2);
    const Y = (v) => ht - pad - ((v - min) / (max - min)) * (ht - pad * 2);
    const pts = h.map((x, i) => `${X(i)},${Y(x.ovr)}`).join(" ");
    return (
      <div className="bg-neutral-950 rounded-2xl px-4 py-3 mb-4">
        <div className="flex justify-between text-[9px] uppercase tracking-widest text-neutral-600 mb-1">
          <span>Tu carrera · OVR</span>
          <span>{h[0].age} → {h[h.length - 1].age} años</span>
        </div>
        <svg viewBox={`0 0 ${w} ${ht}`} className="w-full" style={{ height: 56 }}>
          <polyline points={pts} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          {h.map((x, i) => (
            x.champion ? <circle key={i} cx={X(i)} cy={Y(x.ovr)} r="3.5" fill="#f59e0b" />
            : x.injured ? <circle key={i} cx={X(i)} cy={Y(x.ovr)} r="2.5" fill="#ef4444" />
            : null
          ))}
        </svg>
        <div className="flex gap-3 text-[9px] text-neutral-600 mt-0.5">
          <span><span className="text-amber-500">●</span> título</span>
          <span><span className="text-red-500">●</span> lesión</span>
        </div>
      </div>
    );
  };

  const SeasonSummary = () => {
    if (!lastSeason) return null;
    // avisos como lista para poder animarlos escalonados
    const notices = [];
    if (lastSeason.champion) notices.push({ c: "text-amber-300", t: `🏆 ¡${club(lastSeason.clubId).name} campeón de la ${club(lastSeason.clubId).league}! Cobraste un premio.` });
    if (lastSeason.wonIntlCup) notices.push({ c: "text-amber-300 font-semibold", t: `🌎 ¡Campeón de la ${lastSeason.intlCupName}! El título más grande a nivel clubes.` });
    if (lastSeason.wonNationalCup) notices.push({ c: "text-amber-300", t: `🏆 ¡Ganaste la ${lastSeason.nationalCupName}! Otra vuelta para las vitrinas.` });
    if (lastSeason.natl) notices.push({ c: "text-sky-300", t: `🇦🇷 Convocado a la selección: ${lastSeason.natl.caps} PJ${lastSeason.natl.goals > 0 ? `, ${lastSeason.natl.goals} goles` : ""}.` });
    if (lastSeason.natl?.torneo) notices.push({
      c: lastSeason.natl.torneo.won ? "text-amber-300" : "text-neutral-400",
      t: lastSeason.natl.torneo.won ? `🏆 ¡Ganaste ${lastSeason.natl.torneo.name === "Mundial" ? "el" : "la"} ${lastSeason.natl.torneo.name}!` : `Jugaste ${lastSeason.natl.torneo.name === "Mundial" ? "el" : "la"} ${lastSeason.natl.torneo.name}, pero no alcanzó.`,
    });
    if (lastSeason.ballon) notices.push({ c: "text-yellow-300 font-semibold", t: "✨ ¡Ganaste el Balón de Oro! Sos el mejor jugador del mundo." });
    (lastSeason.milestones || []).forEach((m) => notices.push({ c: "text-violet-300", t: m }));
    if (lastSeason.duelResult === "won") notices.push({ c: "text-violet-300", t: "🥊 Le ganaste el duelo al pibe: el DT te ratificó como referente." });
    if (lastSeason.duelResult === "lost") notices.push({ c: "text-red-400", t: "🥊 El pibe te pasó por arriba y te comió el puesto. Pasaste el año en el banco." });
    if (lastSeason.warning) notices.push({ c: "text-orange-400", t: `⚠️ En ${club(lastSeason.clubId).name} no están conformes: otra temporada así y te sueltan.` });
    if (lastSeason.wasAngry) notices.push({ c: "text-red-400", t: "😡 Tu hinchada no te perdonó la indirecta al clásico rival: jugaste presionado todo el año." });
    if (lastSeason.hintReaction) {
      const hc = club(lastSeason.hintReaction.clubId).name;
      if (lastSeason.hintReaction.type === "interesado") notices.push({ c: "text-emerald-300", t: `🗣️ Tu indirecta funcionó: en ${hc} tomaron nota y te siguen de cerca.` });
      else if (lastSeason.hintReaction.type === "tibio") notices.push({ c: "text-neutral-400", t: `🗣️ Tu indirecta a ${hc} no movió mucho el amperímetro: te ven, pero sin apuro.` });
      else notices.push({ c: "text-red-400", t: `🗣️ ${hc} salió a aclarar públicamente que no estás en sus planes. Te apuntaste demasiado alto.` });
    }

    return (
      <>
        {/* Banner de lesión: rojo, animado, arriba de todo */}
        {lastSeason.injured && (
          <div className={`rounded-2xl mb-4 p-4 anim-slide-down anim-pulse-red border ${lastSeason.severeInjury ? "bg-red-950 border-red-600" : "bg-red-950/70 border-red-800"}`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">🚑</span>
              <div>
                <p className="font-bold text-red-200">{lastSeason.severeInjury ? "Lesión grave" : "Te lesionaste"}</p>
                <p className="text-xs text-red-300/80">
                  {lastSeason.severeInjury
                    ? "Una lesión seria te condicionó el año: perdiste partidos y ritmo. Cuidá tu físico con los fisios."
                    : "Estuviste afuera parte de la temporada. Un cuerpo de fisios reduce mucho el riesgo."}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-neutral-950 rounded-2xl p-4 mb-4 anim-fade-up">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wide">
                Temporada {lastSeason.age} años
              </p>
              <p className="text-sm mt-1">
                <span className={`mr-1.5 text-[10px] font-bold uppercase rounded px-1.5 py-0.5 ${lastSeason.role === "Titular" ? "bg-emerald-900 text-emerald-300" : lastSeason.role === "Rotación" ? "bg-amber-900 text-amber-300" : "bg-neutral-800 text-neutral-400"}`}>{lastSeason.role}</span>
                {lastSeason.pj} PJ · {state.pos === "POR" ? `${lastSeason.cleanSheets || 0} vallas invictas` : `${lastSeason.gls} goles · ${lastSeason.ast} asist.`}</p>
              {lastSeason.pj > 0 && (lastSeason.cupPj > 0 || lastSeason.intlPj > 0) && (
                <p className="text-[10px] text-neutral-500 mt-1">
                  Liga {lastSeason.ligaPj}{lastSeason.cupPj > 0 ? ` · Copa ${lastSeason.cupPj}` : ""}{lastSeason.intlPj > 0 ? ` · Internacional ${lastSeason.intlPj}` : ""}
                </p>
              )}
            </div>
            <div className={`text-2xl font-bold ${lastSeason.rating >= 7 ? "text-emerald-400" : lastSeason.rating < 5.8 ? "text-red-400" : "text-neutral-300"}`}>
              {lastSeason.rating}
            </div>
          </div>
          {notices.length > 0 && (
            <div className="mt-3 pt-3 border-t border-neutral-800 space-y-1.5">
              {notices.map((n, i) => (
                <p key={i} className={`text-sm ${n.c} anim-fade-up`} style={{ animationDelay: `${0.1 + i * 0.12}s` }}>{n.t}</p>
              ))}
            </div>
          )}
        </div>
      </>
    );
  };

  const HistoryTable = ({ compact }) => (
    <div className="bg-neutral-950 rounded-2xl p-4">
      <div className="grid grid-cols-7 text-[10px] uppercase tracking-wider text-neutral-500 pb-2 border-b border-neutral-800">
        <span>Edad</span><span className="col-span-2">Club</span><span className="text-right">OVR</span><span className="text-right">PJ</span><span className="text-right">{state.pos === "POR" ? "VI" : "G"}</span><span className="text-right">{state.pos === "POR" ? "" : "A"}</span>
      </div>
      {(compact ? state.history.slice(-6) : state.history).map((h, i) => (
        <div key={i} className="grid grid-cols-7 text-sm py-1.5 border-b border-neutral-900 last:border-0 items-center">
          <span className="text-neutral-400">{h.age}</span>
          <span className="col-span-2 flex items-center gap-1.5 min-w-0">
            <ClubLogo id={h.clubId} size={16} />
            <span className="truncate">{club(h.clubId).name}</span>
            {h.onLoan && <span className="text-sky-400 text-[10px] shrink-0">(P)</span>}
            {h.champion && <span className="text-amber-400 shrink-0">🏆</span>}
          </span>
          <span className="text-right font-semibold">{h.ovr}</span>
          <span className="text-right text-neutral-400">{h.pj}</span>
          <span className="text-right text-neutral-400">{state.pos === "POR" ? (h.cleanSheets || 0) : h.gls}</span>
          <span className="text-right text-neutral-400">{state.pos === "POR" ? "" : h.ast}</span>
        </div>
      ))}
    </div>
  );

  if (screen === "cantera") {
    return (
      <div className={S.page}>
        <div className={S.card}>
          <Logo />
          <Header />
          <div className="bg-neutral-950 rounded-2xl p-5">
            <h2 className="text-xl font-bold">Oferta de cantera</h2>
            <p className="text-sm text-neutral-400 mt-1 mb-2">Tres clubes quieren sumarte a su proyecto juvenil. Elegí dónde empieza tu carrera.</p>
            <p className="text-xs text-neutral-500 mb-4">Ojo: un club más grande te desarrolla más rápido, pero vas a pelear más el puesto — y si no jugás, te sueltan.</p>
            <div className="grid grid-cols-3 gap-2">
              {cantera.map((id) => {
                const c = club(id);
                return (
                  <button key={id} onClick={() => signCantera(id)}
                    className="bg-neutral-900 rounded-xl p-3 text-center hover:bg-neutral-800 transition active:scale-95">
                    <p className="text-[10px] text-neutral-500 mb-1">Fichar por</p>
                    <div className="flex justify-center mb-1"><ClubLogo id={id} size={32} /></div>
                    <p className="font-bold text-xs leading-tight break-words">{c.name}</p>
                    <p className="text-[9px] text-neutral-500 mt-1.5">{leagueShort(c.league)}</p>
                    <p className="text-[10px] text-emerald-400 mt-1">Nivel {c.prestige}</p>
                  </button>
                );
              })}
            </div>
          </div>
          </div>
          <Footer />
      </div>
    );
  }

  // --- PRÉSTAMO: sos joven en un grande y no jugaste — elegí dónde foguearte ---
  if (screen === "prestamo") {
    const options = loanOptions(state);
    const c = club(state.clubId);
    return (
      <div className={S.page}>
        <div className={S.card}>
          <Logo />
          <Header />
          <SeasonSummary />
          <div className="bg-neutral-950 rounded-2xl p-5 border border-sky-900">
            <h2 className="text-xl font-bold text-sky-300">{c.name} te manda a préstamo</h2>
            <p className="text-sm text-neutral-300 mt-1 mb-4">Sos joven y necesitás rodaje. El club te ofrece estas opciones — elegí donde te sientas más cómodo. Si mejorás, decidís si volvés o te quedás.</p>
            <div className="space-y-3">
              {options.map((o) => (
                <button key={o.id} onClick={() => chooseLoan(o)}
                  className="w-full text-left bg-neutral-900 rounded-xl p-4 hover:bg-neutral-800 transition active:scale-[0.98]">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 min-w-0">
                      <ClubLogo id={o.id} size={28} />
                      <div className="min-w-0">
                        <p className="font-bold truncate">{o.name}</p>
                        <p className="text-xs text-neutral-500 truncate">{leagueShort(o.league)} · Nivel {o.prestige}</p>
                      </div>
                    </div>
                    <span className="text-xs text-sky-300 shrink-0 ml-2">Vas a jugar seguro</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          </div>
          <Footer />
      </div>
    );
  }

  // --- FIN DEL PRÉSTAMO: ¿volvés o te quedás? ---
  if (screen === "finPrestamo") {
    const parent = club(state.parentClubId);
    const here = club(state.clubId);
    const canStay = lastSeason && lastSeason.rating >= 6.3;
    return (
      <div className={S.page}>
        <div className={S.card}>
          <Logo />
          <Header />
          <SeasonSummary />
          <div className="bg-neutral-950 rounded-2xl p-5">
            <h2 className="text-xl font-bold">Se terminó el préstamo</h2>
            <p className="text-sm text-neutral-400 mt-1 mb-4">
              {canStay
                ? `En ${here.name} están contentos con vos y quieren comprar tu pase. ${parent.name} espera tu vuelta. Vos decidís.`
                : `Tu paso por ${here.name} no convenció como para que compren tu pase. Volvés a ${parent.name}.`}
            </p>
            <div className="space-y-2">
              <button className={S.btnPrimary} onClick={() => endLoan(false)}>Volver a {parent.name}</button>
              {canStay && (
                <button className={`${S.btnGhost} w-full`} onClick={() => endLoan(true)}>Fichar definitivo por {here.name}</button>
              )}
            </div>
          </div>
          </div>
          <Footer />
      </div>
    );
  }

  // --- FESTEJO: pantalla de celebración con confetti antes del diario ---
  if (screen === "festejo" && celebration) {
    return (
      <div className={S.page}>
        <div className={S.card}>
          <Confetti />
          <div className="relative flex flex-col items-center justify-center text-center py-16">
            <div className="text-7xl mb-4 anim-trophy">{celebration.emoji}</div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-amber-400 mb-2 anim-fade-up" style={{ animationDelay: "0.15s" }}>Temporada {lastSeason.age} años</p>
            <h1 className="text-4xl font-black text-amber-200 leading-tight anim-pop-in" style={{ animationDelay: "0.2s" }}>{celebration.title}</h1>
            <p className="text-neutral-300 mt-3 anim-fade-up" style={{ animationDelay: "0.4s" }}>{celebration.subtitle}</p>
            <button
              onClick={() => { setCelebration(null); setScreen("diario"); }}
              className={`${S.btnPrimary} mt-10 anim-fade-up`} style={{ animationDelay: "0.6s", maxWidth: 260 }}>
              Seguir
            </button>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  // --- MOMENTO DECISIVO: el jugador elige qué hacer ---
  if (screen === "clutch" && clutch?.moment) {
    const m = clutch.moment;
    return (
      <div className={S.page}>
        <div className={S.card}>
          <div className="anim-fade-up">
            <div className="text-center mb-4">
              <div className="text-6xl mb-3 anim-pop-in">{m.emoji}</div>
              <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded ${m.type === "pitch" ? "bg-emerald-900 text-emerald-300" : "bg-sky-900 text-sky-300"}`}>
                {m.type === "pitch" ? "Momento decisivo" : "Fuera de la cancha"}
              </span>
              <h1 className="text-2xl font-black mt-3">{m.title}</h1>
              <p className="text-sm text-neutral-400 mt-2">{m.setup}</p>
            </div>
            <div className="space-y-2 mt-5">
              {m.options.map((o, i) => (
                <button key={i} onClick={() => chooseClutch(o)}
                  className="w-full text-left bg-neutral-900 hover:bg-neutral-800 rounded-xl p-3.5 transition active:scale-[0.98] anim-fade-up border border-neutral-800"
                  style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                  <div className="flex justify-between items-center gap-2">
                    <p className="font-bold text-sm">{o.label}</p>
                    <span className={`text-[9px] uppercase font-bold shrink-0 px-1.5 py-0.5 rounded ${o.risk >= 0.4 ? "bg-red-950 text-red-400" : o.risk >= 0.25 ? "bg-amber-950 text-amber-400" : "bg-emerald-950 text-emerald-400"}`}>
                      {o.risk >= 0.4 ? "Arriesgado" : o.risk >= 0.25 ? "Medio" : "Seguro"}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{o.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  // --- RESULTADO del momento decisivo ---
  if (screen === "clutchResult" && clutchResult) {
    const r = clutchResult;
    return (
      <div className={S.page}>
        <div className={S.card}>
          {r.success && <Confetti />}
          <div className="relative flex flex-col items-center justify-center text-center py-14">
            <div className="text-7xl mb-4 anim-pop-in">{r.success ? "🌟" : "😞"}</div>
            <p className={`text-[11px] uppercase tracking-[0.3em] mb-2 ${r.success ? "text-emerald-400" : "text-red-400"}`}>
              {r.moment.title}
            </p>
            <h1 className={`text-3xl font-black leading-tight anim-pop-in ${r.success ? "text-emerald-200" : "text-red-200"}`}>
              {r.success ? "¡LO LOGRASTE!" : "NO SALIÓ"}
            </h1>
            <p className="text-sm text-neutral-300 mt-3 max-w-xs">{r.text}</p>
            <p className="text-xs text-neutral-500 mt-2 italic">Elegiste: {r.option.label}</p>
            <button onClick={continueFromClutch}
              className={`${S.btnPrimary} mt-10`} style={{ maxWidth: 260 }}>
              Seguir con la temporada
            </button>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  // --- TAPA DEL DIARIO: el titular de tu temporada ---
  if (screen === "diario") {
    const e = lastSeason;
    const c = club(e.clubId);
    const ap = state.apellido;
    let head, sub;
    if (diarioKind === "fin") { head = `GRACIAS, ${ap}`; sub = `Después de ${state.history.length} temporadas, cuelga los botines una parte de la historia del fútbol argentino.`; }
    else if (e.ballon) { head = "EL MEJOR DEL MUNDO"; sub = `${ap} gana el Balón de Oro tras una temporada inolvidable en ${c.name}.`; }
    else if (e.natl?.torneo?.won && e.natl.torneo.name === "Mundial") { head = "CAMPEONES DEL MUNDO"; sub = `${ap} y la Selección tocan el cielo con las manos.`; }
    else if (e.natl?.torneo?.won) { head = "¡CAMPEÓN DE AMÉRICA!"; sub = `${ap} levanta la Copa con la Selección.`; }
    else if (e.wonIntlCup) { head = `¡GLORIA CONTINENTAL!`; sub = `${c.name} conquista la ${e.intlCupName} y ${ap} lo grita a lo loco.`; }
    else if (e.champion) { head = `¡${c.name.toUpperCase()} CAMPEÓN!`; sub = `${ap} clave en la vuelta olímpica: ${e.gls > 0 ? `${e.gls} goles en ` : ""}${e.pj} partidos.`; }
    else if (e.wonNationalCup) { head = `¡COPERO!`; sub = `${c.name} se queda con la ${e.nationalCupName} de la mano de ${ap}.`; }
    else if (diarioKind === "prestamo") { head = "A FOGUEARSE"; sub = `${c.name} manda a ${ap} (${e.age}) a préstamo en busca de minutos.`; }
    else if (diarioKind === "released") { head = "FIN DE CICLO"; sub = `${c.name} decide no contar más con ${ap}. El mercado espera.`; }
    else if (diarioKind === "duelo") { head = "LA JOYA QUE PIDE PISTA"; sub = `Un juvenil presiona en ${c.name} y el puesto de ${ap} tambalea.`; }
    else if (diarioKind === "vuelta") { head = "¿VUELVE A CASA?"; sub = `En el club de sus amores sueñan con la vuelta de ${ap}.`; }
    else if (e.duelResult === "won") { head = "EL VIEJO Y QUERIDO"; sub = `${ap} le ganó el duelo a la joventud y sigue siendo dueño del puesto.`; }
    else if (e.duelResult === "lost") { head = "CAMBIO DE GUARDIA"; sub = `El pibe le ganó el lugar a ${ap}, que pasó el año en el banco.`; }
    else if (e.severeInjury) { head = "PARTE MÉDICO PREOCUPANTE"; sub = `Lesión grave de ${ap}: temporada marcada por la recuperación.`; }
    else if (e.rating >= 7.8) { head = "TEMPORADA SOÑADA"; sub = `${ap} la rompió en ${c.name}: ${e.gls > 0 ? `${e.gls} goles, ` : ""}rating ${e.rating}.`; }
    else if (e.hintReaction?.type === "desmentido") { head = "\"NO ESTÁ EN NUESTROS PLANES\""; sub = `Desde ${club(e.hintReaction.clubId).name} salieron a bajarle el pulgar a ${ap} tras sus declaraciones. Un baldazo de agua fría.`; }
    else if (e.hintReaction?.type === "interesado") { head = "SUENA FUERTE"; sub = `${club(e.hintReaction.clubId).name} sigue de cerca a ${ap} después de sus palabras. El pase se calienta.`; }
    else if (e.warning) { head = "BAJO LA LUPA"; sub = `En ${c.name} pierden la paciencia con ${ap}. La próxima temporada define todo.`; }
    else { head = "OTRA VUELTA AL SOL"; sub = `Temporada ${e.rating >= 6.5 ? "correcta" : "irregular"} de ${ap} en ${c.name}: ${e.pj} partidos, rating ${e.rating}.`; }
    // ¿Fue una temporada de gloria? (para darle el fondo festivo con confetti)
    const glory = e.champion || e.wonIntlCup || e.wonNationalCup || e.ballon || e.natl?.torneo?.won;

    // Repaso completo de la temporada: lista de todo lo que pasó, punto por punto.
    const recap = [];
    const statLine = state.pos === "POR"
      ? `🧤 ${e.cleanSheets || 0} vallas invictas en ${e.pj} partidos.`
      : `⚽ ${e.gls} goles y ${e.ast} asistencias en ${e.pj} partidos.`;
    recap.push({ txt: statLine, tone: "info" });
    if (e.champion) recap.push({ txt: `🏆 ¡CAMPEONES de la ${leagueShort(c.league).split(" · ")[1] || "Liga"} con ${c.name}!`, tone: "gold" });
    if (e.wonIntlCup) recap.push({ txt: `🌎 ¡Campeón de la ${e.intlCupName}! Gloria continental.`, tone: "gold" });
    else if (e.inIntlCup && e.intlPj > 0) recap.push({ txt: `🌎 ${e.intlCupName}: ${e.intlPj >= 10 ? "llegaste lejos" : "quedaste en el camino"}.`, tone: "info" });
    if (e.wonNationalCup) recap.push({ txt: `🏆 ¡Ganaste la ${e.nationalCupName}! Otra para la vitrina.`, tone: "gold" });
    if (e.ballon) recap.push({ txt: `✨ ¡Ganaste el Balón de Oro! El mejor del mundo.`, tone: "gold" });
    if (e.natl) {
      if (e.natl.torneo?.won) recap.push({ txt: `🏆 ¡Campeón de ${e.natl.torneo.name === "Mundial" ? "el Mundial" : "la " + e.natl.torneo.name} con la Selección!`, tone: "gold" });
      else if (e.natl.torneo) recap.push({ txt: `📺 ${e.natl.torneo.name}: quedaste en el camino con la Selección.`, tone: "info" });
      else recap.push({ txt: `🇦🇷 Convocado a la Selección: ${e.natl.caps} PJ${e.natl.goals > 0 ? `, ${e.natl.goals} goles` : ""}.`, tone: "info" });
    }
    (e.milestones || []).forEach((m) => recap.push({ txt: m, tone: "special" }));
    if (e.duelResult === "won") recap.push({ txt: `🥊 Le ganaste el duelo al pibe: seguís siendo dueño del puesto.`, tone: "special" });
    if (e.duelResult === "lost") recap.push({ txt: `🥊 El pibe te comió el puesto: pasaste el año en el banco.`, tone: "bad" });
    if (e.hintReaction?.type === "interesado") recap.push({ txt: `🗣️ ${club(e.hintReaction.clubId).name} tomó nota de tu indirecta y te sigue de cerca.`, tone: "info" });
    if (e.hintReaction?.type === "desmentido") recap.push({ txt: `🗣️ ${club(e.hintReaction.clubId).name} salió a aclarar que no estás en sus planes.`, tone: "bad" });
    if (e.severeInjury) recap.push({ txt: `🚑 Lesión grave: la temporada quedó marcada por la recuperación.`, tone: "bad" });
    else if (e.injured) recap.push({ txt: `🩹 Te lesionaste y te perdiste parte del año.`, tone: "bad" });
    if (e.wasAngry) recap.push({ txt: `😡 La hinchada no te perdonó la indirecta al clásico: jugaste presionado.`, tone: "bad" });
    if (e.warning) recap.push({ txt: `⚠️ En ${c.name} pierden la paciencia: la próxima define.`, tone: "bad" });

    const toneColor = { gold: "text-amber-300", special: "text-violet-300", info: "text-neutral-300", bad: "text-red-300" };

    return (
      <div className={S.page}>
        <div className={S.card}>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-neutral-950 border border-neutral-800">
            {glory && <Confetti />}
            {/* Cabecera del diario */}
            <div className="relative flex items-center justify-between px-4 py-3 border-b border-neutral-800">
              <span className="font-black text-lg tracking-tight text-red-500" style={{ fontFamily: "Georgia, serif" }}>EL DEPORTIVO</span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500">{mesDeTemporada(state.history.length)} · Temporada {state.history.length}</span>
            </div>
            {/* Titular principal */}
            <div className="relative px-4 pt-5 pb-3">
              <h1 className="font-black text-4xl leading-[0.95] tracking-tight text-white" style={{ fontFamily: "Georgia, serif" }}>{head}</h1>
              <p className="text-sm text-neutral-400 mt-3 leading-snug">{sub}</p>
            </div>
            {/* Repaso completo de la temporada */}
            <div className="relative px-4 pb-4 space-y-2">
              {recap.map((r, i) => (
                <div key={i} className="flex gap-2 border-l-2 border-neutral-700 pl-3 anim-fade-up" style={{ animationDelay: `${0.05 + i * 0.07}s` }}>
                  <p className={`text-sm leading-snug ${toneColor[r.tone]}`}>{r.txt}</p>
                </div>
              ))}
            </div>
            {/* Pie con el club y botón de seguir */}
            <button onClick={() => setScreen(postDiario)} className="relative w-full flex items-center justify-between px-4 py-3 border-t border-neutral-800 bg-neutral-900/50 active:bg-neutral-900 transition">
              <span className="flex items-center gap-2 text-xs text-neutral-400">
                <ClubLogo id={e.clubId} size={18} /> {c.name}
              </span>
              <span className="text-xs font-semibold text-white">Seguir →</span>
            </button>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  // --- DUELO GENERACIONAL ---
  if (screen === "duelo") {
    const c = club(state.clubId);
    const escape = club(state.duelOfferClub);
    return (
      <div className={S.page}>
        <div className={S.card}>
          <Logo />
          <Header />
          <SeasonSummary />
          <div className="bg-neutral-950 border border-violet-900 rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-widest text-violet-400 mb-1">El fútbol no espera</p>
            <h2 className="text-xl font-bold text-violet-200">Un pibe viene por tu puesto</h2>
            <p className="text-sm text-neutral-300 mt-2 mb-4">En {c.name} subieron a un juvenil que la rompe en las prácticas y la prensa ya pide su debut. Tenés {state.age} años y no venís brillando. ¿Qué hacés?</p>
            <div className="space-y-2">
              <button className={S.btnPrimary} onClick={() => answerDuel(true)}>
                Pelear el puesto 🥊
              </button>
              <p className="text-[11px] text-neutral-500 text-center">Si le ganás el duelo, el DT te ratifica. Si te pasa por arriba, vas al banco.</p>
              <button className={`${S.btnGhost} w-full`} onClick={() => answerDuel(false)}>
                Irte a {escape.name}, que te llama
              </button>
            </div>
          </div>
          </div>
          <Footer />
      </div>
    );
  }

  // --- LA VUELTA A CASA: el club que te formó te llama ---
  if (screen === "vuelta") {
    const home = club(state.homeOffer);
    return (
      <div className={S.page}>
        <div className={S.card}>
          <Logo />
          <Header />
          <div className="bg-gradient-to-b from-amber-950/60 to-neutral-950 border border-amber-800 rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-widest text-amber-400 mb-1">Llamada especial</p>
            <h2 className="text-xl font-bold text-amber-200">{home.name} quiere que vuelvas</h2>
            <p className="text-sm text-neutral-300 mt-2 mb-1">Sos un jugador de renombre y en el club que te formó la hinchada colgó banderas con tu nombre. Te ofrecen menos plata que en Europa, pero te ofrecen otra cosa: ser ídolo.</p>
            <p className="text-xs text-neutral-500 mb-4">Si volvés, la hinchada te banca para siempre: nunca te van a soltar, sin importar cómo rindas.</p>
            <div className="space-y-2">
              <button className={S.btnPrimary} onClick={() => answerHome(true)}>Volver a casa ❤️ ({fmtMoney(Math.round(state.wage * 0.6))}/año)</button>
              <button className={`${S.btnGhost} w-full`} onClick={() => answerHome(false)}>Todavía no es el momento</button>
            </div>
          </div>
          </div>
          <Footer />
      </div>
    );
  }

  // --- MERCADO: la primera decisión del fin de temporada ---
  if (screen === "mercado") {
    const c = club(state.clubId);
    return (
      <div className={S.page}>
        <div className={S.card}>
          <Logo />
          <Header />
          <CareerChart />
          <SeasonSummary />
          <div className="mb-4"><HistoryTable compact /></div>

          <div className={`rounded-2xl p-5 mb-4 ${released ? "bg-red-950/60 border border-red-800" : "bg-neutral-950"}`}>
            {released ? (
              <>
                <h2 className="text-xl font-bold text-red-300">{c.name} te suelta</h2>
                <p className="text-sm text-neutral-300 mt-1 mb-4">No rendiste lo que esperaban y no te renuevan. Tenés que aceptar alguna de estas ofertas para no quedarte sin jugar.</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold">Mercado de pases</h2>
                <p className="text-sm text-neutral-400 mt-1 mb-2">
                  {offers.length > 0 ? "¿Seguís donde estás o fichás? Podés negociar cada oferta." : "Esta temporada nadie preguntó por vos."}
                </p>
                <div className="flex items-center gap-2 bg-neutral-900 rounded-lg px-3 py-2 mb-4 text-sm">
                  <ClubLogo id={state.clubId} size={18} />
                  <span className="text-neutral-400">Tu sueldo actual en {c.name}:</span>
                  <span className="font-bold text-white ml-auto">{fmtMoney(state.wage)}<span className="text-xs text-neutral-500">/año</span></span>
                </div>
              </>
            )}
            {negMsg && <p className={`text-sm mb-3 ${negMsg.ok ? "text-emerald-400" : "text-red-400"}`}>{negMsg.text}</p>}
            <div className="space-y-3">
              {offers.map((o, idx) => {
                const oc = club(o.clubId);
                return (
                  <div key={o.clubId} className="bg-neutral-900 rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <ClubLogo id={o.clubId} size={32} />
                        <div className="min-w-0">
                          <p className="font-bold truncate">{oc.name}</p>
                          <p className="text-xs text-neutral-500 truncate">{leagueShort(oc.league)} · Nivel {oc.prestige}</p>
                          {o.returning && <p className="text-[10px] text-sky-400 font-semibold mt-0.5">💙 Te conocen y te quieren de vuelta</p>}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <p className="font-bold text-emerald-400">{fmtMoney(o.wage)}<span className="text-xs text-neutral-500">/año</span></p>
                        {state.clubId && (
                          <p className={`text-[10px] font-semibold ${o.wage > state.wage ? "text-emerald-400" : o.wage < state.wage ? "text-red-400" : "text-neutral-500"}`}>
                            {o.wage > state.wage ? `↑ +${fmtMoney(o.wage - state.wage)}` : o.wage < state.wage ? `↓ ${fmtMoney(o.wage - state.wage)}` : "= igual"}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 bg-white text-black rounded-full py-2 text-sm font-semibold active:scale-95" onClick={() => chooseClub(o)}>Fichar</button>
                      {(() => {
                        const risk = withdrawRiskFor(o);
                        // el botón se "calienta" según el riesgo de que retiren la oferta
                        const tier = risk >= 0.5 ? "bg-red-600 text-white hover:bg-red-500"
                          : risk >= 0.35 ? "bg-red-500 text-white hover:bg-red-400"
                          : risk >= 0.2 ? "bg-orange-500 text-orange-950 hover:bg-orange-400"
                          : "bg-amber-500 text-amber-950 hover:bg-amber-400";
                        return (
                          <button className={`flex-1 rounded-full py-2 text-sm font-semibold active:scale-95 transition-colors ${tier}`} onClick={() => negotiate(o, idx)}>
                            Negociar{o.negotiations ? ` · ${Math.round(risk * 100)}% riesgo` : ""}
                          </button>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {!released && (
            <button className={S.btnPrimary} onClick={() => chooseClub(null)}>
              Seguir en {c.name} · {fmtMoney(state.wage)}/año
            </button>
          )}
          {state.age >= 31 && (
            <button className="w-full mt-3 text-sm text-neutral-500 underline underline-offset-4 hover:text-white transition"
              onClick={() => setScreen("fin")}>
              Colgar los botines ahora
            </button>
          )}
          </div>
          <Footer />
      </div>
    );
  }

  // --- PRETEMPORADA: la segunda decisión — en qué invertir ---
  if (screen === "pretemporada") {
    const canTrainer = state.money >= trainerCost(state);
    const canFisio = state.money >= fisioCost(state);
    const canAgent = !state.agent && state.money >= agentCost(state);
    const canPress = state.money >= pressCost(state);
    const canClause = !state.medicalClause && state.money >= clauseCost(state);
    const injuryProne = (state.injuries || 0) >= 3; // te ofrecemos la cláusula si venís golpeado
    return (
      <div className={S.page}>
        <div className={S.card}>
          <Logo />
          <Header />
          <CareerChart />
          <div className="bg-neutral-950 rounded-2xl p-4 mb-4">
            <h2 className="font-bold mb-1">Pretemporada en {club(state.clubId).name}</h2>
            <p className="text-xs text-neutral-500 mb-3">Elegí una acción para el año. Cada una gasta tu temporada — la indirecta de abajo es aparte y opcional.</p>
            <div className="space-y-2">
              <DecisionCard
                title="💪 Preparador personal" cost={fmtMoney(trainerCost(state))} disabled={!canTrainer}
                desc="Entrenás fuerte todo el año: tu OVR sube más rápido que de costumbre. La mejor forma de acelerar tu crecimiento."
                onClick={() => invest({ trainer: true })}
              />
              <DecisionCard
                title="🩺 Cuerpo de fisios" cost={fmtMoney(fisioCost(state))} disabled={!canFisio}
                desc={`Baja tu riesgo de lesión del ${Math.round(injuryRisk(state, false) * 100)}% al ${Math.round(injuryRisk(state, true) * 100)}% este año${state.age >= 28 ? ", y frena la caída de OVR por la edad." : "."}${state.injuries > 0 ? ` Ya llevás ${state.injuries} lesi${state.injuries === 1 ? "ón" : "ones"}: tu cuerpo lo necesita.` : ""}`}
                onClick={() => invest({ fisio: true })}
              />
              <DecisionCard
                title="📣 Campaña de prensa" cost={fmtMoney(pressCost(state))} disabled={!canPress}
                desc="Contratás prensa para agrandar tu figura este año: más chances de ser convocado a la Selección y de pelear el Balón de Oro. Puro ego."
                onClick={() => invest({ press: true })}
              />
              {!state.agent && (
                <DecisionCard
                  title="🕴️ Agente de élite" cost={fmtMoney(agentCost(state))} disabled={!canAgent}
                  desc="Se paga una sola vez y queda para siempre: vas a recibir más ofertas de fichaje y a negociar mejores sueldos toda tu carrera."
                  onClick={() => invest({ agent: true })}
                />
              )}
              {injuryProne && !state.medicalClause && (
                <DecisionCard
                  title="🏥 Cláusula médica" cost={fmtMoney(clauseCost(state))} disabled={!canClause}
                  desc="Un plan médico permanente: baja tu riesgo de lesión para el resto de tu carrera y tranquiliza a los clubes grandes, que dejan de desconfiar de tu físico."
                  onClick={() => invest({ clause: true })}
                />
              )}
              <DecisionCard
                title="🏖️ Pretemporada tranquila" cost="Gratis" costOk
                desc="No gastás nada y guardás la plata en el banco. Tu OVR evoluciona solo, según tu club y tu edad."
                onClick={() => invest({})}
              />
            </div>

            {/* Indirecta: abajo de todo, opcional, no gasta la acción del año */}
            {hintTargets.length > 0 && (
              <div className="bg-neutral-900 rounded-xl p-3 mt-3 border-t-2 border-neutral-800">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm">🗣️ Tirar una indirecta</p>
                  {state.hintCooldown > 0
                    ? <span className="text-xs text-neutral-500">Podés usarla de nuevo en {state.hintCooldown} temporada{state.hintCooldown > 1 ? "s" : ""}</span>
                    : <span className="text-xs text-emerald-400">Disponible · opcional</span>}
                </div>
                {state.hintCooldown === 0 && (
                  <>
                    <p className="text-xs text-neutral-500 mt-0.5 mb-2">Le decís a la prensa que querés jugar en cierto club. Sube mucho la chance de que ese club te ofrezca fichaje al final del año. No gasta tu acción. ⚠️ = clásico rival: enoja a tu hinchada.</p>
                    {pendingHint ? (
                      <button onClick={() => setPendingHint(null)}
                        className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 ${RIVALS[state.clubId] === pendingHint ? "bg-red-950 border border-red-700" : "bg-white/10 border border-white/30"}`}>
                        <span className="text-sm font-semibold flex items-center gap-1.5"><ClubLogo id={pendingHint} size={16} />{club(pendingHint).name}{RIVALS[state.clubId] === pendingHint ? " ⚠️" : ""}</span>
                        <span className="text-xs text-neutral-400">✕ quitar</span>
                      </button>
                    ) : (
                      <ClubPicker targets={hintTargets} rival={RIVALS[state.clubId]} playerOvr={state.ovr} onPick={setPendingHint} />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          </div>
          <Footer />
      </div>
    );
  }

  if (screen === "fin") {
    const peak = Math.max(...state.history.map((h) => h.ovr));
    const totalGls = state.history.reduce((s, h) => s + h.gls, 0);
    const totalAst = state.history.reduce((s, h) => s + h.ast, 0);
    const totalCS = state.history.reduce((s, h) => s + (h.cleanSheets || 0), 0);
    const totalPj = state.history.reduce((s, h) => s + h.pj, 0);
    const isKeeper = state.pos === "POR";
    const bestClub = state.history.reduce((a, b) => (club(a.clubId).prestige > club(b.clubId).prestige ? a : b));
    const ballons = state.trophies.filter((t) => t.name === "Balón de Oro").length;
    const leg = LEGENDS[posGroup(state.pos)];
    const myStat = leg.statOf(state);
    const peakTier = ovrTier(peak);
    const cardGradient = peakTier.grad;
    return (
      <div className={S.page}>
        <div className={S.card}>
          <Logo />

          {/* ===== TARJETA DE CARRERA (para screenshot y compartir) ===== */}
          <div className={`rounded-3xl bg-gradient-to-b ${cardGradient} p-1 mb-4 shadow-2xl`}>
            <div className="rounded-[22px] bg-black/85 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/50">Carrera finalizada</p>
                  <h1 className="text-3xl font-black tracking-tight">{state.apellido}</h1>
                  <p className="text-sm text-white/60">#{state.numero} · {state.pos} · {state.pierna === "Izquierda" ? "Zurdo" : "Diestro"} · 🇦🇷</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black">{peak}</p>
                  <p className="text-[9px] uppercase tracking-widest text-white/50">OVR pico</p>
                  <p className="text-[9px] uppercase tracking-wider text-white/70 font-bold mt-0.5">{peakTier.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                <div><p className="text-lg font-bold">{totalPj}</p><p className="text-[9px] uppercase text-white/50">PJ</p></div>
                {isKeeper ? (
                  <div><p className="text-lg font-bold">{totalCS}</p><p className="text-[9px] uppercase text-white/50">Vallas inv.</p></div>
                ) : (
                  <div><p className="text-lg font-bold">{totalGls}</p><p className="text-[9px] uppercase text-white/50">Goles</p></div>
                )}
                {isKeeper ? (
                  <div><p className="text-lg font-bold">{totalGls + totalAst}</p><p className="text-[9px] uppercase text-white/50">G+A</p></div>
                ) : (
                  <div><p className="text-lg font-bold">{totalAst}</p><p className="text-[9px] uppercase text-white/50">Asist.</p></div>
                )}
                <div><p className="text-lg font-bold text-emerald-400">{fmtMoney(state.money)}</p><p className="text-[9px] uppercase text-white/50">Fortuna</p></div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {ballons > 0 && <Chip gold>{"✨".repeat(Math.min(ballons, 3))} {ballons} Balón{ballons > 1 ? "es" : ""} de Oro</Chip>}
                {state.trophies.some((t) => t.name === "Mundial") && <Chip gold>🏆 Campeón del Mundo</Chip>}
                {state.trophies.filter((t) => t.name !== "Balón de Oro" && t.name !== "Mundial").length > 0 && (
                  <Chip>🏆 {state.trophies.filter((t) => t.name !== "Balón de Oro" && t.name !== "Mundial").length} títulos</Chip>
                )}
                {state.caps > 0 && <Chip>🇦🇷 {state.caps} PJ selección</Chip>}
                {state.idolo && state.formative.includes(state.clubId) && <Chip gold>❤️ Ídolo de {club(state.clubId).name}</Chip>}
              </div>
              <p className="text-sm text-white/80 italic mt-4 leading-snug">"{legacyVerdict(state, peak)}"</p>
              <p className="text-[10px] text-white/40 mt-3 flex items-center gap-1.5">
                <ClubLogo id={bestClub.clubId} size={14} />
                Mejor momento: {club(bestClub.clubId).name}, {bestClub.age} años · Retiro a los {state.age}
              </p>
            </div>
          </div>

          {/* ===== Comparación con la leyenda de tu posición ===== */}
          <div className="bg-neutral-950 rounded-2xl p-5 mb-4">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-3 text-center">Tu legado vs {leg.name}</p>
            <CompareBar label={`OVR máximo (${leg.name}: ${leg.peak})`} mine={peak} pct={Math.round((peak / leg.peak) * 100)} />
            <CompareBar label={`${leg.statLabel} (${leg.name}: ${leg.statRef})`} mine={myStat} pct={Math.round(Math.min(myStat / leg.statRef, 1) * 100)} />
            <CompareBar label={`Títulos (${leg.name}: 30+)`} mine={state.trophies.length} pct={Math.round(Math.min(state.trophies.length / 30, 1) * 100)} />
          </div>

          {state.trophies.length > 0 && (
            <div className="bg-neutral-950 rounded-2xl p-5 mb-4">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 mb-2 text-center">Vitrina</p>
              {state.trophies.map((t, i) => {
                const icon = t.name === "Balón de Oro" ? "✨"
                  : t.name === "Champions League" || t.name === "Copa Libertadores" ? "🌎"
                  : t.name === "Mundial" || t.name === "Copa América" ? "🌍" : "🏆";
                const label = t.name.includes("(") ? t.name.replace(/\s*\(([^)]+)\)/, " $1") : t.name;
                return (
                  <p key={i} className="text-sm text-amber-300">{icon} {label} <span className="text-neutral-500">· {t.clubId ? club(t.clubId).name : "Selección"} · {t.age} años</span></p>
                );
              })}
            </div>
          )}

          <HistoryTable />
          <button className={`${S.btnPrimary} mt-4`} onClick={() => window.location.reload()}>Nueva carrera</button>
          </div>
          <Footer />
      </div>
    );
  }

  return null;
}

// ---------- MICRO-COMPONENTES ----------

// Colores de escudo para clubes conocidos; el resto se genera del id (consistente).
const CLUB_COLORS = {
  river: ["#ffffff", "#e30613"], boca: ["#0a3d91", "#f9d616"], racing: ["#6cb7e6", "#ffffff"],
  independiente: ["#e30613", "#ffffff"], sanlo: ["#c8102e", "#00287d"], estudiantes: ["#e2001a", "#ffffff"],
  velez: ["#ffffff", "#00308f"], huracan: ["#ffffff", "#e2001a"], lanus: ["#7a002a", "#ffffff"],
  newells: ["#e2001a", "#000000"], central: ["#0e4d92", "#f9d616"], talleres: ["#0a3d91", "#ffffff"],
  boca2: ["#0a3d91", "#f9d616"],
  madrid: ["#ffffff", "#febe10"], barcelona: ["#a50044", "#004d98"], atletico: ["#cb3524", "#ffffff"],
  sevilla: ["#ffffff", "#d81920"], betis: ["#00954c", "#ffffff"], valencia: ["#ffffff", "#f18e00"],
  athletic: ["#ee2523", "#ffffff"], realsociedad: ["#0067b1", "#ffffff"], villarreal: ["#ffe667", "#005187"],
  bayern: ["#dc052d", "#ffffff"], dortmund: ["#fde100", "#000000"], leverkusen: ["#e32219", "#000000"],
  leipzig: ["#dd0741", "#001f47"], stuttgart: ["#ffffff", "#e30613"], frankfurt: ["#e1000f", "#000000"],
  inter: ["#010e80", "#000000"], milan: ["#fb090b", "#000000"], juventus: ["#000000", "#ffffff"],
  napoli: ["#12a0d7", "#ffffff"], roma: ["#8e1111", "#f0bc42"], lazio: ["#87d8f7", "#ffffff"], torino: ["#8a1538", "#ffffff"],
  mancity: ["#6cabdd", "#ffffff"], arsenal: ["#ef0107", "#ffffff"], liverpool: ["#c8102e", "#ffffff"],
  chelsea: ["#034694", "#ffffff"], mancity_utd: ["#da291c", "#ffffff"], tottenham: ["#ffffff", "#132257"],
  newcastle: ["#241f20", "#ffffff"], villa: ["#95bfe5", "#670e36"], everton: ["#003399", "#ffffff"],
  nacional: ["#0a7d2c", "#ffffff"], millonarios: ["#004b9b", "#ffffff"], america_cali: ["#e2001a", "#ffffff"],
  junior: ["#e2001a", "#ffffff"], cali: ["#0a7d2c", "#ffffff"], medellin: ["#e2001a", "#00287d"],
  leeds: ["#ffffff", "#1d428a"], burnley: ["#6c1d45", "#87d8f7"], sunderland: ["#eb172b", "#ffffff"],
};

function clubColors(id) {
  if (CLUB_COLORS[id]) return CLUB_COLORS[id];
  // color determinístico a partir del id para los que no están en la lista
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const hue = Math.abs(hash) % 360;
  return [`hsl(${hue}, 55%, 42%)`, `hsl(${(hue + 40) % 360}, 60%, 75%)`];
}

function clubInitials(name) {
  const clean = name.replace(/[.'']/g, "");
  const words = clean.split(" ").filter((w) => w.length > 1 && !["de", "del", "la"].includes(w.toLowerCase()));
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return clean.slice(0, 3).toUpperCase();
}

// Dominios oficiales de los clubes para traer el logo real vía servicio de logos.
// Si un club no está acá o la imagen falla, se usa el escudo generado como respaldo.
// IDs de equipo de ESPN VERIFICADOS para traer el logo oficial desde su CDN.
// Solo incluimos clubes con ID confirmado. Los que no están acá usan el escudo
// generado — preferible a mostrar un logo equivocado.
const CLUB_ESPN = {
  // Argentina (confirmados)
  river: 16, boca: 5, sanlo: 18,
  // España
  madrid: 86, barcelona: 83, atletico: 1068, sevilla: 243, betis: 244, realsociedad: 89,
  villarreal: 102, athletic: 93, valencia: 94, girona: 9812, osasuna: 97, celta: 85,
  getafe: 2922, mallorca: 84, rayo: 101, alaves: 96, laspalmas: 98, leganes: 17534,
  valladolid: 95, espanyol: 88,
  // Alemania
  bayern: 132, dortmund: 124, leverkusen: 131, leipzig: 11420, stuttgart: 134, frankfurt: 125,
  freiburg: 126, wolfsburg: 138, gladbach: 268, mainz: 2950, hoffenheim: 7911, bremen: 137,
  augsburg: 3841, bochum: 121, heidenheim: 10469, stpauli: 269, holstein: 3390,
  // Italia
  inter: 110, milan: 103, juventus: 111, napoli: 114, roma: 104, lazio: 112, atalanta: 105,
  fiorentina: 109, bologna: 107, torino: 2739, udinese: 115, genoa: 2891, monza: 5453,
  lecce: 2807, cagliari: 2925, verona: 2900, parma: 116, como: 2919, empoli: 2749, venezia: 3057,
  // Inglaterra
  mancity: 382, arsenal: 359, liverpool: 364, chelsea: 363, mancity_utd: 360, tottenham: 367,
  newcastle: 361, villa: 362, westham: 371, brighton: 331, bournemouth: 349, palace: 384,
  fulham: 370, wolves: 380, everton: 368, brentford: 337, forest: 393, leicester: 375,
  ipswich: 373, southampton: 376, leeds: 357, burnley: 379, sheffield: 398, sunderland: 366,
  westbrom: 383, norwich: 381, middlesbrough: 369, coventry: 388,
};

function clubLogoUrl(id) {
  const espnId = CLUB_ESPN[id];
  if (!espnId) return null;
  // CDN de ESPN (misma URL que usa su propia web). Logos oficiales, gratis, sin API key.
  // Si falla, ClubLogo cae al escudo generado.
  return `https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/${espnId}.png&h=80&w=80`;
}

// Escudo generado (respaldo cuando no hay logo real o falla la carga)
function CrestSVG({ id, name, size }) {
  const [bg, fg] = clubColors(id);
  const initials = clubInitials(name);
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="shrink-0" aria-hidden="true">
      <path d="M20 2 L36 7 V20 C36 30 28 36 20 38 C12 36 4 30 4 20 V7 Z" fill={bg} stroke="rgba(0,0,0,0.25)" strokeWidth="1" />
      <path d="M20 2 L36 7 V20 C36 30 28 36 20 38 C12 36 4 30 4 20 V7 Z" fill="none" stroke={fg} strokeWidth="1.5" opacity="0.6" />
      <text x="20" y="24" textAnchor="middle" fontSize="13" fontWeight="800" fill={fg} fontFamily="system-ui, sans-serif">{initials}</text>
    </svg>
  );
}

function ClubLogo({ id, size = 20 }) {
  const [failed, setFailed] = useState(false);
  if (!id) return null;
  const c = CLUBS.find((x) => x.id === id);
  if (!c) return null;
  const url = clubLogoUrl(id);
  // si hay logo real y no falló la carga, lo mostramos; si no, el escudo generado
  if (url && !failed) {
    return (
      <img
        src={url}
        alt={c.name}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setFailed(true)}
        className="shrink-0 object-contain rounded-sm"
        style={{ width: size, height: size }}
      />
    );
  }
  return <CrestSVG id={id} name={c.name} size={size} />;
}

function Logo() {
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <span className="bg-white text-black rounded-lg w-7 h-7 flex items-center justify-center text-sm font-black">⚽</span>
      <span className="font-black text-xl tracking-tight">Carrerarda</span>
    </div>
  );
}

function Footer() {
  return (
    <p className="text-center text-[11px] text-neutral-600 mt-6 mb-2">
      Ignacio Karvouniaris · Proyecto personal 2026
    </p>
  );
}

function DecisionCard({ title, desc, cost, costOk, disabled, onClick }) {
  return (
    <button disabled={disabled} onClick={onClick}
      className="w-full text-left bg-neutral-900 rounded-xl p-3 transition active:scale-[0.98] hover:bg-neutral-800 disabled:opacity-35 disabled:cursor-not-allowed">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-sm">{title}</p>
        <span className={`text-xs ${costOk ? "text-emerald-400" : "text-amber-400"}`}>{cost}</span>
      </div>
      <p className="text-xs text-neutral-500 mt-0.5">{desc}</p>
    </button>
  );
}

function ClubPicker({ targets, rival, playerOvr, onPick }) {
  const [q, setQ] = useState("");
  const [lg, setLg] = useState("Todas");
  const leagues = ["Todas", ...Array.from(new Set(targets.map((c) => c.league)))];
  const filtered = targets.filter((c) =>
    (lg === "Todas" || c.league === lg) &&
    c.name.toLowerCase().includes(q.toLowerCase())
  );
  // ¿Cómo va a reaccionar el club a tu nivel? (mismo criterio que invest)
  const reactionHint = (req) => {
    const gap = (playerOvr || 0) - req;
    if (gap >= 3) return { label: "te querrían", cls: "text-emerald-400" };
    if (gap >= -5) return { label: "quizás", cls: "text-amber-400" };
    return { label: "muy alto", cls: "text-red-400" };
  };
  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar club…"
        className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-white/50 mb-2"
      />
      <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: "none" }}>
        {leagues.map((l) => (
          <button key={l} onClick={() => setLg(l)}
            className={`shrink-0 text-xs font-semibold rounded-full px-3 py-1.5 transition ${lg === l ? "bg-white text-black" : "bg-neutral-800 text-neutral-400"}`}>
            {l === "Todas" ? "Todas" : l.split(" (")[0]}
          </button>
        ))}
      </div>
      <div className="max-h-52 overflow-y-auto space-y-1 mt-1">
        {filtered.length === 0 && <p className="text-xs text-neutral-600 text-center py-3">Sin clubes que coincidan.</p>}
        {filtered.map((c) => {
          const isRival = rival === c.id;
          const rh = reactionHint(c.req);
          return (
            <button key={c.id} onClick={() => onPick(c.id)}
              className={`w-full flex items-center justify-between rounded-lg px-3 py-2.5 transition active:scale-[0.98] ${isRival ? "bg-red-950/40 hover:bg-red-950/70" : "bg-black hover:bg-neutral-800"}`}>
              <span className="flex items-center gap-1.5 min-w-0">
                <ClubLogo id={c.id} size={16} />
                <span className={`text-sm font-semibold truncate ${isRival ? "text-red-300" : ""}`}>{c.name}{isRival ? " ⚠️" : ""}</span>
              </span>
              <span className={`text-[10px] shrink-0 ml-2 ${rh.cls}`}>{rh.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Confetti() {
  // 60 papelitos con color, posición, retraso y duración aleatorios
  const pieces = Array.from({ length: 60 }, (_, i) => {
    const colors = ["#f59e0b", "#fbbf24", "#10b981", "#3b82f6", "#ef4444", "#ffffff", "#a855f7"];
    return {
      left: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 0.6,
      duration: 2 + Math.random() * 1.5,
      size: 6 + Math.random() * 6,
    };
  });
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            top: 0,
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 1.4,
            background: p.color,
            borderRadius: 2,
            animation: `confettiFall ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

function Chip({ children, gold }) {
  return (
    <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${gold ? "bg-amber-400/20 text-amber-300 border border-amber-500/40" : "bg-white/10 text-white/80"}`}>
      {children}
    </span>
  );
}

function CompareBar({ label, mine, pct }) {
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-neutral-400">{label}</span>
        <span className="font-semibold">{mine} · {pct}%</span>
      </div>
      <div className="h-2 bg-neutral-900 rounded-full overflow-hidden">
        <div className={`h-full ${pct >= 85 ? "bg-yellow-400" : pct >= 55 ? "bg-emerald-500" : "bg-neutral-600"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

function Progress({ value }) {
  return (
    <div className="h-1.5 bg-neutral-900 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" style={{ width: `${value}%` }} />
    </div>
  );
}
