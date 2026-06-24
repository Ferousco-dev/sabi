export const CHIPS = [
  "WAEC / NECO aligned", "Offline-first sync", "NDPR compliant",
  "SMS alerts on any network", "Works on budget devices",
  "Hausa · Yoruba · Igbo (2026)", "OMobile preloaded",
  "AI-assisted grading", "< 50 MB installed", "3G optimised",
];

export const PILL_LINKS = ["Schools", "Teachers", "Students", "Creators"];

export const PERSONAS = [
  {
    num: "01", role: "Schools",
    headline: "Manage your whole school from one screen.",
    points: ["Digital enrollment & profiles", "WAEC/NECO timetable builder", "Real-time attendance & analytics", "Fee management (Phase 2)"],
    gradient: "radial-gradient(circle at 50% 0%, #AA852E28 0%, #AA852E08 40%, #F0EEE6 70%)",
    accent: "#AA852E",
  },
  {
    num: "02", role: "Teachers",
    headline: "Build rich lessons. Grade without the grind.",
    points: ["Multimedia lesson builder", "WAEC-aligned templates", "Assignment & rubric creator", "AI-assisted grading (Phase 2)"],
    gradient: "radial-gradient(circle at 50% 0%, #013D4730 0%, #013D4710 40%, #F0EEE6 70%)",
    accent: "#013D47",
  },
  {
    num: "03", role: "Students",
    headline: "Learn anywhere. Even when the network dies.",
    points: ["Offline content & quizzes", "CRDT sync on reconnect", "XP points & milestone badges", "Personalised learning paths"],
    gradient: "radial-gradient(circle at 50% 0%, #AA852E22 0%, #013D4712 40%, #F0EEE6 70%)",
    accent: "#AA852E",
  },
  {
    num: "04", role: "Parents",
    headline: "Stay in the loop without chasing the school.",
    points: ["Real-time grade dashboard", "Attendance calendar view", "SMS alerts on MTN, Airtel, Glo", "Multi-child switcher"],
    gradient: "radial-gradient(circle at 50% 0%, #9FE1CB30 0%, #013D4708 40%, #F0EEE6 70%)",
    accent: "#0F6E56",
  },
];

export const ROADMAP = [
  { phase: "Phase 1", date: "Sept 2026", label: "Pilot", desc: "100,000 schools across Nigeria. All 5 personas live on day one." },
  { phase: "Phase 2", date: "Sept 2027", label: "Scale", desc: "500,000+ schools. Hausa, Yoruba, Igbo localisation added." },
  { phase: "Phase 3", date: "Sept 2028", label: "Future", desc: "AR/VR labs, SabiLeague national student competitions." },
];

export const STATS = [
  { num: "50M",   label: "Students targeted by 2030" },
  { num: "500K+", label: "Schools by Phase 2" },
  { num: "80%",   label: "Dropout reduction goal" },
  { num: "50K",   label: "Certified creators" },
];
