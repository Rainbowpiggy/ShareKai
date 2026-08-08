"use client";

import React, { useState, useMemo } from "react";
import {
  Menu, X, Search, Apple, Egg, Wheat, Fish, Cookie, Package, Milk,
  Carrot, Soup, Sandwich, Bell, BellOff, ChevronRight, ChevronDown,
  Check, AlertTriangle, Clock, Leaf, Users, TrendingUp, Award,
  ShieldCheck, LogOut, User, ClipboardList, Sparkles, Send,
  ArrowLeft, Plus, Minus, Camera, FileDown, Settings, Newspaper,
  CalendarDays, RefreshCw, MapPin, Timer, ThumbsUp, ThumbsDown,
  Upload, ImageOff, ShieldAlert, Hourglass, CheckCircle2, MessageCircle,
  ScanLine, Lock
} from "lucide-react";

/* ---------------------------------- tokens ---------------------------------- */
const C = {
  cream: "#F6F1E4",
  creamDeep: "#EFE7D3",
  sage: "#AFC49F",
  sageLight: "#C7D8B9",
  sageDeep: "#7E9770",
  forest: "#2E4630",
  forestSoft: "#4A6350",
  gold: "#E5BE5C",
  goldDeep: "#C99A31",
  blue: "#AECBDA",
  blueDeep: "#7FA4B8",
  amber: "#DE9A45",
  red: "#C96A57",
  green: "#5E9463",
  paper: "#FCFAF3",
};

const FONT_DISPLAY = "'Fraunces', Georgia, serif";
const FONT_BODY = "'Inter', system-ui, sans-serif";

const iconFor = (name) => {
  const n = name.toLowerCase();
  if (n.includes("apple")) return Apple;
  if (n.includes("banana")) return Sandwich;
  if (n.includes("egg")) return Egg;
  if (n.includes("bread") || n.includes("loaf") || n.includes("scone")) return Wheat;
  if (n.includes("tuna") || n.includes("can") || n.includes("fish")) return Fish;
  if (n.includes("milk")) return Milk;
  if (n.includes("carrot") || n.includes("veg")) return Carrot;
  if (n.includes("soup")) return Soup;
  if (n.includes("cookie") || n.includes("biscuit")) return Cookie;
  return Package;
};

/* ---------------------------------- seed data ---------------------------------- */
const seedInventory = [
  { id: "i1", name: "Apples", qty: 5, unit: "items", category: "Fruit", perishable: true, type: "Rescued Surplus", deadline: "Today, 3:00pm", allergens: [], status: "Low Stock", urgency: "amber", lastChecked: "9:12am", weightKg: 1.1, source: "Canteen", storageLocation: "Fruit basket", receivedAt: "Today, 7:40am" },
  { id: "i2", name: "Bananas", qty: 3, unit: "items", category: "Fruit", perishable: true, type: "Rescued Surplus", deadline: "Today, 1:00pm", allergens: [], status: "Low Stock", urgency: "red", lastChecked: "9:12am", weightKg: 0.6, source: "Canteen", storageLocation: "Fruit basket", receivedAt: "Today, 7:40am" },
  { id: "i3", name: "Canned Tuna", qty: 10, unit: "cans", category: "Canned food", perishable: false, type: "Regular Donation", deadline: "Best before Dec 2026", allergens: ["Fish"], status: "Available", urgency: "green", lastChecked: "8:50am", weightKg: 1.8, source: "Household donation", storageLocation: "Pantry shelf A", receivedAt: "Yesterday, 3:15pm" },
  { id: "i4", name: "Loaf of Bread", qty: 1, unit: "loaf", category: "Bread", perishable: true, type: "Rescued Surplus", deadline: "Today, 2:00pm", allergens: ["Gluten"], status: "Low Stock", urgency: "red", lastChecked: "9:12am", weightKg: 0.7, source: "School lunch provider", storageLocation: "Bread box", receivedAt: "Today, 7:45am" },
  { id: "i5", name: "Eggs", qty: 14, unit: "items", category: "Breakfast food", perishable: true, type: "Rescued Surplus", deadline: "Best before Fri", allergens: ["Egg"], status: "Available", urgency: "green", lastChecked: "8:50am", weightKg: 0.9, source: "Garden", storageLocation: "Fridge", receivedAt: "Yesterday, 2:00pm" },
  { id: "i6", name: "Scones", qty: 5, unit: "items", category: "Breakfast food", perishable: true, type: "Regular Donation", deadline: "Today, 4:00pm", allergens: ["Gluten", "Dairy"], status: "Available", urgency: "amber", lastChecked: "9:12am", weightKg: 0.5, source: "School event", storageLocation: "Bread box", receivedAt: "Today, 8:00am" },
];

const seedRequestGroups = [
  { category: "Bread", count: 10, trend: "Frequently available" },
  { category: "Breakfast food", count: 8, trend: "Recently arrived" },
  { category: "Fruit", count: 6, trend: "Recently arrived" },
  { category: "Canned food", count: 4, trend: "No stock yet" },
];

const seedCommunityLog = [
  { id: "c1", text: "14 eggs were added to the pantry.", time: "8:50am", type: "donation" },
  { id: "c2", text: "Five loaves of surplus bread were rescued from the canteen.", time: "7:45am", type: "rescue" },
  { id: "c3", text: "Breakfast food is currently the most requested category.", time: "7:30am", type: "insight" },
  { id: "c4", text: "Ten cans of tuna are now available.", time: "Yesterday, 3:15pm", type: "donation" },
  { id: "c5", text: "Three kilograms of food were rescued today.", time: "Yesterday, 5:00pm", type: "rescue" },
];

const weeklyReport = {
  label: "This Week",
  stats: { donated: 62, rescued: 24, requested: 39, collected: 31, unclaimed: 8, composted: 3 },
  points: [
    "Breakfast food was requested 28 times this week, but only 11 items were supplied. Bread and cereal are currently the most useful surplus categories.",
    "Fruit was widely available, but seven items remained unclaimed. Consider sending an expiring-soon alert earlier next week.",
    "Demand peaks between 8:00am and 8:45am, just before first period.",
  ],
};
const monthlyReport = {
  label: "This Month",
  stats: { donated: 248, rescued: 96, requested: 171, collected: 138, unclaimed: 22, composted: 11 },
  points: [
    "Twenty-five sandwiches are usually left over on Fridays. Consider reducing Friday canteen quantities or adding the surplus to ShareKAI earlier.",
    "Canned food requests have risen 30% since last month, but donations have stayed flat.",
    "75% of surplus was collected before its expiry deadline this month.",
  ],
};
const archiveReports = [
  { id: "a1", title: "Week of 27 July", summary: "Breakfast food shortage flagged; bread donations increased by Friday." },
  { id: "a2", title: "Week of 20 July", summary: "Fruit surplus well collected; canned food remained the most under-supplied category." },
  { id: "a3", title: "June newsletter", summary: "First full month: 96kg genuine surplus rescued, 30-day rescue streak achieved." },
];

const achievementsData = {
  kgRescued: 96.4,
  itemsRedistributed: 214,
  pctBeforeExpiry: 78,
  composted: "11 kg",
  topCategory: "Bread",
  weekly: 24,
  monthly: 96,
  milestones: [
    { label: "First 25kg of food rescued", done: true },
    { label: "100 items redistributed", done: true },
    { label: "75% of surplus collected before expiry", done: true },
    { label: "30-day food-rescue streak", done: false },
  ],
};

const pendingVolunteers = [
  { id: "v1", name: "Volunteer request — Y12" },
  { id: "v2", name: "Volunteer request — Y13" },
];

/* ---------------------------------- AI scanning + chat mock data ---------------------------------- */
const mockScanResults = [
  { name: "Red Apples", qty: "3 items", weightEstimate: "approx. 400g", shelfLifeHours: 48, category: "Fruit", spoil: null },
  { name: "Sliced Wholegrain Bread", qty: "1 loaf (approx. 10 slices)", weightEstimate: "approx. 650g", shelfLifeHours: 24, category: "Bread", spoil: null },
  { name: "Bananas", qty: "4 items", weightEstimate: "approx. 480g", shelfLifeHours: 30, category: "Fruit", spoil: { level: "amber", note: "Slight bruising detected — still edible, but best collected soon." } },
  { name: "Boiled Eggs", qty: "6 items", weightEstimate: "approx. 360g", shelfLifeHours: 72, category: "Breakfast food", spoil: null },
  { name: "Strawberries", qty: "1 punnet (approx. 250g)", weightEstimate: "approx. 250g", shelfLifeHours: 12, category: "Fruit", spoil: { level: "red", note: "Mould detected on several berries — not safe for consumption." } },
];

const moderationRejections = [
  "This image doesn't appear to show a food item.",
  "This image couldn't be verified as safe, everyday food and has been flagged for review.",
];

const EXCHANGE_LOCATIONS = [
  "Main Office Reception",
  "Library Front Desk",
  "Canteen Servery",
  "Student Services Foyer",
];

const CHAT_TIME_SLOTS = ["12:30", "13:00", "13:15", "15:00", "15:15", "15:30"];

const groupRequest = (text) => {
  const t = text.toLowerCase();
  if (/(cereal|breakfast|before class|toast)/.test(t)) return "Breakfast food";
  if (/(bread|loaf|toast)/.test(t)) return "Bread";
  if (/(apple|banana|fruit|orange)/.test(t)) return "Fruit";
  if (/(can|tuna|tin|canned)/.test(t)) return "Canned food";
  return text.trim() ? text.trim()[0].toUpperCase() + text.trim().slice(1) : "General";
};

const uid = () => Math.random().toString(36).slice(2, 9);
const randomCode = () => "SK-" + Math.random().toString(36).slice(2, 7).toUpperCase();

/* ---------------------------------- small ui atoms ---------------------------------- */
function Pill({ children, bg, fg = C.forest, style }) {
  return (
    <span
      style={{ background: bg, color: fg, fontFamily: FONT_BODY, ...style }}
      className="text-xs font-semibold px-2 py-1 rounded-full inline-flex items-center gap-1"
    >
      {children}
    </span>
  );
}

function UrgencyDot({ level }) {
  const map = { green: C.green, amber: C.amber, red: C.red };
  const label = { green: "Safe for a few more days", amber: "Collect soon", red: "Collect today" };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: map[level], fontFamily: FONT_BODY }}>
      <span style={{ width: 8, height: 8, borderRadius: 999, background: map[level], display: "inline-block" }} />
      {label[level]}
    </span>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const isErr = toast.kind === "error";
  return (
    <div
      style={{
        position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
        background: isErr ? C.red : C.forest, color: C.paper, fontFamily: FONT_BODY,
        padding: "10px 18px", borderRadius: 999, fontSize: 14, fontWeight: 600,
        boxShadow: "0 8px 24px rgba(0,0,0,0.18)", zIndex: 100, maxWidth: "90vw", textAlign: "center",
      }}
    >
      {toast.msg}
    </div>
  );
}

function Button({ children, onClick, variant = "primary", full, style, disabled, type = "button" }) {
  const base = {
    fontFamily: FONT_BODY, fontWeight: 700, fontSize: 14, borderRadius: 12,
    padding: "10px 18px", cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1, border: "none", transition: "transform 0.1s",
    width: full ? "100%" : undefined,
  };
  const variants = {
    primary: { background: C.gold, color: C.forest },
    dark: { background: C.forest, color: C.paper },
    outline: { background: "transparent", color: C.forest, border: `1.5px solid ${C.forest}` },
    ghost: { background: C.creamDeep, color: C.forest },
    danger: { background: C.red, color: C.paper },
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...style }}
      className="active:scale-[0.98]"
    >
      {children}
    </button>
  );
}

function Card({ children, style, bg = "#fff", onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: bg, borderRadius: 18, border: `1.5px solid ${C.creamDeep}`,
        boxShadow: "0 2px 10px rgba(46,70,48,0.06)", cursor: onClick ? "pointer" : undefined, ...style,
      }}
      className={onClick ? "active:scale-[0.99]" : undefined}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div className="mb-4">
      <h2 style={{ fontFamily: FONT_DISPLAY, color: C.forest, fontSize: 26, fontWeight: 700 }}>{children}</h2>
      {sub && <p style={{ fontFamily: FONT_BODY, color: C.forestSoft, fontSize: 13.5, marginTop: 2 }}>{sub}</p>}
    </div>
  );
}

/* ---------------------------------- app ---------------------------------- */
export default function ShareKAI() {
  const [session, setSession] = useState(null); // {role, name, code}
  const [page, setPage] = useState("login");
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [inventory, setInventory] = useState(seedInventory);
  const [requestGroups, setRequestGroups] = useState(seedRequestGroups);
  const [myRequests, setMyRequests] = useState([]);
  const [log, setLog] = useState(seedCommunityLog);
  const [offers, setOffers] = useState([]);
  const [notifPrefs, setNotifPrefs] = useState({ enabled: true });
  const [volunteers, setVolunteers] = useState(pendingVolunteers);
  const [referred, setReferred] = useState([]);
  const [chatItem, setChatItem] = useState(null);
  const [reservation, setReservation] = useState(null);

  const showToast = (msg, kind = "success") => {
    setToast({ msg, kind });
    setTimeout(() => setToast(null), 2600);
  };

  const goto = (p) => { setPage(p); setMenuOpen(false); window.scrollTo?.(0, 0); };

  const login = (role) => {
    const names = { student: "Student", volunteer: "Alex (Volunteer)", teacher: "Ms Reid (Coordinator)" };
    setSession({ role, name: names[role], code: randomCode() });
    goto(role === "volunteer" ? "volunteer" : role === "teacher" ? "teacher" : "pantry");
    showToast(`Signed in as ${names[role]}`);
  };

  const logout = () => { setSession(null); goto("login"); };

  const addLog = (text, type = "donation") => {
    setLog((l) => [{ id: uid(), text, time: "Just now", type }, ...l]);
  };

  const submitRequest = ({ category, freeText, notify }) => {
    const groupName = freeText ? groupRequest(freeText) : category;
    setMyRequests((r) => [...r, { id: uid(), category: groupName, code: session.code, notify }]);
    setRequestGroups((groups) => {
      const existing = groups.find((g) => g.category.toLowerCase() === groupName.toLowerCase());
      if (existing) return groups.map((g) => (g === existing ? { ...g, count: g.count + 1 } : g));
      return [...groups, { category: groupName, count: 1, trend: "No stock yet" }];
    });
    showToast(`Request for "${groupName}" submitted confidentially.`);
    goto("requestslist");
  };

  const submitOffer = (text) => {
    setOffers((o) => [...o, { id: uid(), text, status: "Awaiting volunteer inspection" }]);
    addLog(`A community member offered surplus food: "${text}" — awaiting volunteer inspection.`, "offer");
    showToast("Offer submitted — a volunteer will check it soon.");
  };

  const approveOffer = (offer, category = "General") => {
    setOffers((o) => o.filter((x) => x.id !== offer.id));
    const item = {
      id: uid(), name: offer.text, qty: 1, unit: "items", category, perishable: true,
      type: "Rescued Surplus", deadline: "Check with volunteer", allergens: [], status: "Available",
      urgency: "green", lastChecked: "Just now", weightKg: 0.5, source: "Community offer",
      storageLocation: "Pantry", receivedAt: "Just now",
    };
    setInventory((inv) => [item, ...inv]);
    addLog(`"${offer.text}" was approved by a volunteer and added to the live pantry.`, "donation");
    showToast("Offer approved and added to Live Pantry.");
  };

  const addIntakeItem = (item) => {
    setInventory((inv) => [{ ...item, id: uid() }, ...inv]);
    addLog(`${item.qty} ${item.unit} of ${item.name} ${item.type === "Rescued Surplus" ? "were rescued" : "were added"} to the pantry.`, "donation");
    showToast(`${item.name} added to inventory.`);
  };

  const updateItem = (id, patch) => {
    setInventory((inv) => inv.map((it) => (it.id === id ? { ...it, ...patch, lastChecked: "Just now" } : it)));
  };

  const referItem = (draft) => {
    setReferred((r) => [...r, { ...draft, id: uid() }]);
    showToast("Referred to Teacher Coordinator for review.");
  };

  const openChat = (item) => {
    if (!session) { goto("login"); return; }
    if (item.status === "Out of Stock" || item.status === "Reserved") {
      showToast("This item is no longer available to reserve.", "error");
      return;
    }
    setChatItem(item);
    goto("chat");
  };

  const confirmReservation = ({ item, location, date, time }) => {
    setReservation({ item, location, date, time, code: session.code, confirmedAt: "Just now" });
    updateItem(item.id, { status: "Reserved", qty: Math.max(0, item.qty - 1) });
    addLog(`${item.name} was reserved for pickup at ${location}.`, "rescue");
    showToast("Reservation confirmed!");
    setChatItem(null);
    goto("tracker");
  };

  const completePickup = (auto = false) => {
    if (!reservation) return;
    addLog(`${reservation.item.name} was collected from ${reservation.location}.`, "rescue");
    showToast(auto ? "Pickup window ended — reservation closed." : "Marked as collected. Thanks!");
    setReservation(null);
    goto("pantry");
  };

  /* ---------------------------------- shared shell ---------------------------------- */
  const NAV_ITEMS = [
    { key: "pantry", label: "Live Pantry" },
    { key: "communitylog", label: "Community Log" },
    { key: "request", label: "Make a Request" },
    { key: "achievements", label: "Achievements" },
  ];

  const Shell = ({ children }) => (
    <div style={{ background: C.cream, minHeight: "100%", fontFamily: FONT_BODY }} className="min-h-full w-full relative">
      <TopNav />
      <HamburgerMenu />
      <div className="max-w-3xl mx-auto px-4 pb-16 pt-5">{children}</div>
      <Toast toast={toast} />
    </div>
  );

  function TopNav() {
    return (
      <div
        style={{ background: C.forest, position: "sticky", top: 0, zIndex: 40 }}
        className="w-full"
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => setMenuOpen(true)} style={{ color: C.paper }} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2" style={{ color: C.gold, fontFamily: FONT_DISPLAY }}>
            <Leaf size={18} />
            <span style={{ fontWeight: 700, fontSize: 19 }}>ShareKAI</span>
          </div>
          <button onClick={() => goto(session ? (session.role === "volunteer" ? "volunteer" : session.role === "teacher" ? "teacher" : "personal") : "login")} aria-label="Profile">
            <User size={20} style={{ color: C.gold }} />
          </button>
        </div>
        <div className="max-w-3xl mx-auto px-2 flex overflow-x-auto gap-1 pb-2">
          {NAV_ITEMS.map((n) => (
            <button
              key={n.key}
              onClick={() => goto(n.key)}
              style={{
                fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 600, whiteSpace: "nowrap",
                padding: "6px 12px", borderRadius: 999,
                background: page === n.key ? C.gold : "transparent",
                color: page === n.key ? C.forest : C.sageLight,
              }}
            >
              {n.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function HamburgerMenu() {
    if (!menuOpen) return null;
    const Item = ({ label, onClick, icon: Icon }) => (
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-3 px-1"
        style={{ borderBottom: `1px solid ${C.creamDeep}`, fontFamily: FONT_BODY, color: C.forest, fontWeight: 600, fontSize: 15 }}
      >
        <span className="flex items-center gap-2">{Icon && <Icon size={17} />} {label}</span>
        <ChevronRight size={16} style={{ color: C.forestSoft }} />
      </button>
    );
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(46,70,48,0.35)" }} onClick={() => setMenuOpen(false)}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ background: C.paper, width: 300, maxWidth: "85vw", height: "100%", padding: 20, overflowY: "auto" }}
        >
          <div className="flex items-center justify-between mb-4">
            <span style={{ fontFamily: FONT_DISPLAY, fontSize: 20, color: C.forest, fontWeight: 700 }}>Menu</span>
            <button onClick={() => setMenuOpen(false)}><X size={20} style={{ color: C.forest }} /></button>
          </div>
          {session ? (
            <div className="mb-3 p-3 rounded-xl" style={{ background: C.sageLight }}>
              <p style={{ fontFamily: FONT_BODY, fontWeight: 700, color: C.forest, fontSize: 14 }}>{session.name}</p>
              <p style={{ fontFamily: FONT_BODY, color: C.forestSoft, fontSize: 12 }}>Role: {session.role}</p>
            </div>
          ) : (
            <Item label="Login" onClick={() => goto("login")} icon={User} />
          )}
          <Item label="Live Pantry" onClick={() => goto("pantry")} icon={Package} />
          <Item label="Community Log" onClick={() => goto("communitylog")} icon={Newspaper} />
          <Item label="Make a Request" onClick={() => goto("request")} icon={Send} />
          {session && <Item label="Scan a Food Item" onClick={() => goto("scan")} icon={Camera} />}
          {reservation && <Item label="Active Reservation" onClick={() => goto("tracker")} icon={Timer} />}
          <Item label="Achievements" onClick={() => goto("achievements")} icon={Award} />
          {session && <Item label="Personal Contribution" onClick={() => goto("personal")} icon={Sparkles} />}
          <Item label="This Week" onClick={() => goto("week")} icon={CalendarDays} />
          <Item label="This Month" onClick={() => goto("month")} icon={CalendarDays} />
          <Item label="Newsletter Archive" onClick={() => goto("archive")} icon={Newspaper} />
          <Item label="Notification Settings" onClick={() => goto("notif")} icon={Bell} />
          {session?.role === "volunteer" && <Item label="Volunteer Dashboard" onClick={() => goto("volunteer")} icon={ClipboardList} />}
          {session?.role === "teacher" && (
            <>
              <Item label="Volunteer Dashboard" onClick={() => goto("volunteer")} icon={ClipboardList} />
              <Item label="Teacher Dashboard" onClick={() => goto("teacher")} icon={ShieldCheck} />
            </>
          )}
          {session && (
            <button onClick={logout} className="w-full flex items-center gap-2 py-3 px-1 mt-2" style={{ color: C.red, fontFamily: FONT_BODY, fontWeight: 700, fontSize: 15 }}>
              <LogOut size={17} /> Log Out
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ---------------------------------- PAGE: login ---------------------------------- */
  function LoginPage() {
    return (
      <div style={{ background: C.cream, minHeight: "100vh" }} className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center mb-3" style={{ width: 56, height: 56, borderRadius: 999, background: C.gold }}>
              <Leaf size={28} style={{ color: C.forest }} />
            </div>
            <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 30, color: C.forest, fontWeight: 700 }}>ShareKAI</h1>
            <p style={{ fontFamily: FONT_BODY, color: C.forestSoft, fontSize: 14, marginTop: 4 }}>
              Sharing kai, reducing waste, backing manaakitanga at our school.
            </p>
          </div>
          <Card style={{ padding: 22 }}>
            <p style={{ fontFamily: FONT_BODY, fontWeight: 700, color: C.forest, fontSize: 14, marginBottom: 12 }}>
              Sign in with your school account
            </p>
            <div className="flex flex-col gap-3">
              <Button full variant="dark" onClick={() => login("student")}>Continue as Student / Staff</Button>
              <Button full variant="outline" onClick={() => login("volunteer")}>Continue as Student Volunteer</Button>
              <Button full variant="outline" onClick={() => login("teacher")}>Continue as Teacher Coordinator</Button>
            </div>
            <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: C.forestSoft, textAlign: "center", marginTop: 10 }}>
              Demo logins — no real school credentials needed.
            </p>
          </Card>
          <Card style={{ padding: 16, marginTop: 14, background: C.sageLight, border: "none" }}>
            <p className="flex items-start gap-2" style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.forest }}>
              <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              Requests are confidential. Your identity is never shown to donors, volunteers, students or in public request lists — only a random account code is stored.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  /* ---------------------------------- PAGE: live pantry ---------------------------------- */
  function PantryPage() {
    const [q, setQ] = useState("");
    const [cat, setCat] = useState("All");
    const [perishFilter, setPerishFilter] = useState("All");
    const [expiringOnly, setExpiringOnly] = useState(false);

    const categories = ["All", ...Array.from(new Set(inventory.map((i) => i.category)))];

    const filtered = inventory.filter((i) => {
      if (q && !i.name.toLowerCase().includes(q.toLowerCase())) return false;
      if (cat !== "All" && i.category !== cat) return false;
      if (perishFilter === "Perishable" && !i.perishable) return false;
      if (perishFilter === "Non-perishable" && i.perishable) return false;
      if (expiringOnly && i.urgency === "green") return false;
      return true;
    });

    return (
      <div>
        <SectionTitle sub="Food currently available near the canteen. Tap an item to start a reservation chat.">Live Pantry</SectionTitle>

        {session && (
          <button
            onClick={() => goto("scan")}
            className="w-full flex items-center justify-between mb-3 px-3.5 py-2.5 rounded-xl"
            style={{ background: C.forest, color: C.paper, border: "none" }}
          >
            <span className="flex items-center gap-2" style={{ fontFamily: FONT_BODY, fontWeight: 700, fontSize: 13.5 }}>
              <Camera size={16} style={{ color: C.gold }} /> Got food to share? Scan it with AI
            </span>
            <ChevronRight size={16} />
          </button>
        )}

        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl" style={{ background: "#fff", border: `1.5px solid ${C.creamDeep}` }}>
          <Search size={16} style={{ color: C.forestSoft }} />
          <input
            value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search food..."
            style={{ fontFamily: FONT_BODY, fontSize: 14, outline: "none", width: "100%", background: "transparent", color: C.forest }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-2">
          <select value={cat} onChange={(e) => setCat(e.target.value)} style={selectStyle}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={perishFilter} onChange={(e) => setPerishFilter(e.target.value)} style={selectStyle}>
            <option>All</option><option>Perishable</option><option>Non-perishable</option>
          </select>
          <button
            onClick={() => setExpiringOnly((v) => !v)}
            style={{
              ...selectStyle, background: expiringOnly ? C.amber : "#fff",
              color: expiringOnly ? "#fff" : C.forest, fontWeight: 700, display: "flex", alignItems: "center", gap: 4,
            }}
          >
            <AlertTriangle size={13} /> Expiring soon
          </button>
        </div>

        <p style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.forestSoft, marginBottom: 10 }} className="flex items-center gap-1">
          <Clock size={12} /> Quantities are updated by volunteers at intervals, not live. Each card shows when it was last checked.
        </p>

        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((item) => {
            const Icon = iconFor(item.name);
            const unavailable = item.status === "Out of Stock" || item.status === "Reserved";
            return (
              <Card key={item.id} bg={C.sageLight} style={{ padding: 14, borderRadius: 20, opacity: unavailable ? 0.75 : 1 }} onClick={() => openChat(item)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div style={{ background: "#fff", borderRadius: 999, padding: 8 }}>
                      <Icon size={20} style={{ color: C.forest }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.forest, fontSize: 16 }}>{item.name}</p>
                      <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.forestSoft }}>~{item.qty} {item.unit} · {item.category}</p>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: C.forestSoft, flexShrink: 0, marginTop: 4 }} />
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  <Pill bg="#fff">{item.perishable ? "Perishable" : "Non-perishable"}</Pill>
                  <Pill bg="#fff">{item.type}</Pill>
                  <Pill bg={item.status === "Out of Stock" ? C.red : item.status === "Low Stock" ? C.amber : item.status === "Reserved" ? C.blueDeep : C.green} fg="#fff">{item.status}</Pill>
                </div>
                {item.allergens.length > 0 && (
                  <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.red, marginTop: 6 }}>Contains: {item.allergens.join(", ")}</p>
                )}
                {item.deadline && (
                  <p style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.forestSoft, marginTop: 4 }}>Collect by: {item.deadline}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <UrgencyDot level={item.urgency} />
                  <span style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: C.forestSoft }}>Checked {item.lastChecked}</span>
                </div>
                {!unavailable && (
                  <p className="flex items-center gap-1 mt-2.5" style={{ fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700, color: C.forestSoft }}>
                    <MessageCircle size={12} /> Tap to reserve &amp; chat
                  </p>
                )}
              </Card>
            );
          })}
          {filtered.length === 0 && <EmptyState text="No food matches those filters right now. Try clearing a filter." />}
        </div>
      </div>
    );
  }

  const selectStyle = {
    fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 600, padding: "7px 10px",
    borderRadius: 999, border: `1.5px solid ${C.creamDeep}`, background: "#fff", color: C.forest,
  };

  function EmptyState({ text }) {
    return (
      <Card style={{ padding: 24, textAlign: "center", gridColumn: "1/-1" }} bg={C.paper}>
        <Package size={26} style={{ color: C.forestSoft, margin: "0 auto 8px" }} />
        <p style={{ fontFamily: FONT_BODY, color: C.forestSoft, fontSize: 13.5 }}>{text}</p>
      </Card>
    );
  }

  /* ---------------------------------- PAGE: make a request ---------------------------------- */
  function RequestPage() {
    const [category, setCategory] = useState("Bread");
    const [freeText, setFreeText] = useState("");
    const [notify, setNotify] = useState(true);
    const [sent, setSent] = useState(false);

    if (!session) return <LoginGate />;

    return (
      <div>
        <SectionTitle sub="Tell the pantry what would help. This never reserves food.">Make a Request</SectionTitle>
        <Card style={{ padding: 18 }}>
          <label style={labelStyle}>Food category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...selectStyle, width: "100%", padding: "10px 12px", marginBottom: 14 }}>
            {["Bread", "Breakfast food", "Fruit", "Canned food", "Dairy", "Other"].map((c) => <option key={c}>{c}</option>)}
          </select>

          <label style={labelStyle}>Optional free-text request</label>
          <textarea
            value={freeText} onChange={(e) => setFreeText(e.target.value)}
            placeholder='e.g. "something for breakfast before class"'
            rows={3}
            style={{ ...selectStyle, width: "100%", padding: 10, marginBottom: 6, resize: "none" }}
          />
          <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.forestSoft, marginBottom: 14 }} className="flex items-center gap-1">
            <Sparkles size={12} /> AI groups similar wording — this will be filed under a shared category like "Breakfast food".
          </p>

          <div className="flex items-center justify-between mb-4 p-3 rounded-xl" style={{ background: C.creamDeep }}>
            <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.forest, fontWeight: 600 }}>Notify me if this becomes available</span>
            <button onClick={() => setNotify((v) => !v)}>
              {notify ? <Bell size={20} style={{ color: C.forest }} /> : <BellOff size={20} style={{ color: C.forestSoft }} />}
            </button>
          </div>

          <Button full onClick={() => { submitRequest({ category, freeText, notify }); setSent(true); }}>
            Submit request
          </Button>
        </Card>

        <Card style={{ padding: 14, marginTop: 12, background: C.blue, border: "none" }}>
          <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.forest }}>
            Requests show the pantry what the school community needs. They do not reserve food or guarantee that it will become available. All pantry food remains first come, first served.
          </p>
        </Card>
        <Card style={{ padding: 14, marginTop: 10, background: C.sageLight, border: "none" }}>
          <p className="flex items-start gap-2" style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.forest }}>
            <ShieldCheck size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            Your request is stored under account code <strong>{session.code}</strong> — never your name.
          </p>
        </Card>
      </div>
    );
  }

  const labelStyle = { fontFamily: FONT_BODY, fontSize: 12.5, fontWeight: 700, color: C.forest, marginBottom: 6, display: "block" };

  function LoginGate() {
    return (
      <Card style={{ padding: 26, textAlign: "center" }}>
        <User size={26} style={{ color: C.forestSoft, margin: "0 auto 10px" }} />
        <p style={{ fontFamily: FONT_BODY, color: C.forest, fontWeight: 700, marginBottom: 4 }}>Sign in to continue</p>
        <p style={{ fontFamily: FONT_BODY, color: C.forestSoft, fontSize: 13, marginBottom: 14 }}>This page needs a school account.</p>
        <Button onClick={() => goto("login")}>Go to Login</Button>
      </Card>
    );
  }

  /* ---------------------------------- PAGE: requests list ---------------------------------- */
  function RequestsListPage() {
    return (
      <div>
        <SectionTitle sub="Aggregated community need — no names, classes or IDs are ever shown.">Community Requests</SectionTitle>
        <div className="flex flex-col gap-2.5">
          {[...requestGroups].sort((a, b) => b.count - a.count).map((g) => (
            <Card key={g.category} style={{ padding: 14 }}>
              <div className="flex items-center justify-between">
                <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.forest, fontSize: 16 }}>{g.category}</p>
                <Pill bg={C.gold}>{g.count} community members</Pill>
              </div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.forestSoft, marginTop: 4 }}>{g.trend}</p>
            </Card>
          ))}
        </div>
        <Button full variant="outline" style={{ marginTop: 14 }} onClick={() => goto("request")}>Make a request</Button>
      </div>
    );
  }

  /* ---------------------------------- PAGE: community log ---------------------------------- */
  function CommunityLogPage() {
    const [offerText, setOfferText] = useState("");
    return (
      <div>
        <SectionTitle sub="A friendly, anonymous feed of what's moving through the pantry.">Community Log</SectionTitle>

        <Card style={{ padding: 14, marginBottom: 14, background: C.blue, border: "none" }}>
          <label style={{ ...labelStyle, color: C.forest }}>Offer surplus food to the pantry</label>
          <div className="flex gap-2">
            <input
              value={offerText} onChange={(e) => setOfferText(e.target.value)}
              placeholder="e.g. unopened box of crackers"
              style={{ ...selectStyle, flex: 1, padding: "9px 12px", background: "#fff" }}
            />
            <Button onClick={() => { if (!offerText.trim()) return; submitOffer(offerText.trim()); setOfferText(""); }}>Offer</Button>
          </div>
          <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.forest, marginTop: 6 }}>
            Offers are labelled "Awaiting volunteer inspection" and won't appear in the Live Pantry until a volunteer checks them.
          </p>
        </Card>

        {offers.length > 0 && (
          <div className="mb-4">
            <p style={{ ...labelStyle }}>Awaiting inspection</p>
            <div className="flex flex-col gap-2">
              {offers.map((o) => (
                <Card key={o.id} style={{ padding: 12 }} bg={C.creamDeep}>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: C.forest }}>{o.text}</span>
                    <Pill bg={C.amber} fg="#fff">Awaiting inspection</Pill>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {log.map((entry) => (
            <div key={entry.id} className="flex gap-3 items-start p-3 rounded-2xl" style={{ background: "#fff", border: `1.5px solid ${C.creamDeep}` }}>
              <div style={{ background: C.sageLight, borderRadius: 999, padding: 7, flexShrink: 0 }}>
                {entry.type === "rescue" ? <Leaf size={14} style={{ color: C.forest }} /> : entry.type === "insight" ? <TrendingUp size={14} style={{ color: C.forest }} /> : <Package size={14} style={{ color: C.forest }} />}
              </div>
              <div>
                <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: C.forest }}>{entry.text}</p>
                <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: C.forestSoft, marginTop: 2 }}>{entry.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------------------------- PAGE: achievements ---------------------------------- */
  function AchievementsPage() {
    const a = achievementsData;
    const stat = (label, value) => (
      <Card style={{ padding: 14, textAlign: "center" }} bg={C.sageLight}>
        <p style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: C.forest }}>{value}</p>
        <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.forestSoft }}>{label}</p>
      </Card>
    );
    return (
      <div>
        <SectionTitle sub="Celebrating waste reduction — never who collected what.">Achievements</SectionTitle>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-5">
          {stat("kg genuine surplus rescued", a.kgRescued)}
          {stat("items redistributed", a.itemsRedistributed)}
          {stat("collected before expiry", a.pctBeforeExpiry + "%")}
          {stat("composted", a.composted)}
          {stat("top rescue category", a.topCategory)}
          {stat("this week", a.weekly + " kg")}
        </div>
        <p style={{ ...labelStyle }}>Community milestones</p>
        <div className="flex flex-col gap-2">
          {a.milestones.map((m) => (
            <div key={m.label} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: m.done ? C.sageLight : "#fff", border: `1.5px solid ${C.creamDeep}` }}>
              <div style={{ background: m.done ? C.forest : C.creamDeep, borderRadius: 999, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {m.done ? <Check size={14} color="#fff" /> : <Clock size={13} color={C.forestSoft} />}
              </div>
              <span style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: C.forest, fontWeight: m.done ? 700 : 500 }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function PersonalPage() {
    if (!session) return <LoginGate />;
    const isVol = session.role !== "student";
    return (
      <div>
        <SectionTitle sub="Only positive contributions appear here — never requests or collections.">Personal Contribution</SectionTitle>
        {isVol ? (
          <div className="grid grid-cols-2 gap-2.5">
            <Card style={{ padding: 14, textAlign: "center" }} bg={C.sageLight}>
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: C.forest }}>{inventory.length}</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.forestSoft }}>items you've logged</p>
            </Card>
            <Card style={{ padding: 14, textAlign: "center" }} bg={C.sageLight}>
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: C.forest }}>6</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.forestSoft }}>volunteer sessions</p>
            </Card>
          </div>
        ) : (
          <Card style={{ padding: 20, textAlign: "center" }}>
            <Sparkles size={22} style={{ color: C.forestSoft, margin: "0 auto 8px" }} />
            <p style={{ fontFamily: FONT_BODY, color: C.forestSoft, fontSize: 13.5 }}>
              You haven't logged a donation or volunteer shift yet. Offer surplus food from the Community Log to get started.
            </p>
          </Card>
        )}
      </div>
    );
  }

  /* ---------------------------------- PAGE: reports ---------------------------------- */
  function ReportView({ report }) {
    return (
      <div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {Object.entries(report.stats).map(([k, v]) => (
            <Card key={k} style={{ padding: 10, textAlign: "center" }} bg={C.creamDeep}>
              <p style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700, color: C.forest }}>{v}</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 9.5, color: C.forestSoft, textTransform: "capitalize" }}>{k}</p>
            </Card>
          ))}
        </div>
        <div className="flex flex-col gap-2.5">
          {report.points.map((p, idx) => (
            <Card key={idx} style={{ padding: 13 }} bg={C.blue}>
              <p className="flex items-start gap-2" style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.forest }}>
                <Sparkles size={14} style={{ flexShrink: 0, marginTop: 2 }} /> {p}
              </p>
            </Card>
          ))}
        </div>
        <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: C.forestSoft, marginTop: 10 }}>
          AI-generated recommendations for volunteers and teachers — not guarantees.
        </p>
      </div>
    );
  }

  function ReportsPage({ which }) {
    const tabs = [
      { key: "week", label: "This Week" },
      { key: "month", label: "This Month" },
      { key: "archive", label: "Newsletter Archive" },
    ];
    return (
      <div>
        <SectionTitle>AI Community Reports</SectionTitle>
        <div className="flex gap-2 mb-4">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => goto(t.key)} style={{
              ...selectStyle, background: which === t.key ? C.forest : "#fff", color: which === t.key ? "#fff" : C.forest,
            }}>{t.label}</button>
          ))}
        </div>
        {which === "week" && <ReportView report={weeklyReport} />}
        {which === "month" && <ReportView report={monthlyReport} />}
        {which === "archive" && (
          <div className="flex flex-col gap-2.5">
            {archiveReports.map((r) => (
              <Card key={r.id} style={{ padding: 14 }}>
                <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.forest, fontSize: 15 }}>{r.title}</p>
                <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.forestSoft, marginTop: 3 }}>{r.summary}</p>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ---------------------------------- PAGE: notif settings ---------------------------------- */
  function NotifPage() {
    return (
      <div>
        <SectionTitle sub="Choose whether ShareKAI can notify you about matching food.">Notification Settings</SectionTitle>
        <Card style={{ padding: 16 }}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ fontFamily: FONT_BODY, fontWeight: 700, color: C.forest, fontSize: 14 }}>Matching-food notifications</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.forestSoft, marginTop: 2 }}>Get notified when a category you requested becomes available.</p>
            </div>
            <button onClick={() => setNotifPrefs((p) => ({ enabled: !p.enabled }))}>
              {notifPrefs.enabled ? <Bell size={22} style={{ color: C.forest }} /> : <BellOff size={22} style={{ color: C.forestSoft }} />}
            </button>
          </div>
        </Card>
        <p style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.forestSoft, marginTop: 10 }}>
          Turning this off never affects whether you can browse or request food — it only controls notifications.
        </p>
      </div>
    );
  }

  /* ---------------------------------- PAGE: volunteer dashboard ---------------------------------- */
  function VolunteerDashboard() {
    if (!session || session.role === "student") return <LoginGate />;
    const [tab, setTab] = useState("intake");
    const [checklist, setChecklist] = useState({});
    const checklistItems = [
      "Packaging is unopened and undamaged",
      "Label is readable",
      "Food is not past its use-by date",
      "Storage requirements are known",
      "Food shows no obvious signs of damage or contamination",
      "Chilled food came from an approved and traceable school source",
      "The item meets the school's pantry rules",
    ];
    const allChecked = checklistItems.every((c) => checklist[c]);

    const [draft, setDraft] = useState({
      name: "", category: "Fruit", qty: 1, unit: "items", weightKg: 0.3, type: "Rescued Surplus",
      source: "Canteen", reason: "", perishable: true, bestBefore: "", useBy: "", allergens: "",
      storage: "Pantry shelf", photo: false,
    });

    const resetDraft = () => setDraft({ name: "", category: "Fruit", qty: 1, unit: "items", weightKg: 0.3, type: "Rescued Surplus", source: "Canteen", reason: "", perishable: true, bestBefore: "", useBy: "", allergens: "", storage: "Pantry shelf", photo: false });

    return (
      <div>
        <SectionTitle sub="Protected — visible only to volunteers and teacher coordinators.">Volunteer Dashboard</SectionTitle>
        <div className="flex gap-2 mb-4 flex-wrap">
          {[["intake", "Morning Intake"], ["inventory", "Manage Inventory"], ["requests", "Aggregated Requests"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ ...selectStyle, background: tab === k ? C.forest : "#fff", color: tab === k ? "#fff" : C.forest }}>{l}</button>
          ))}
        </div>

        {tab === "intake" && (
          <Card style={{ padding: 16 }}>
            <p style={labelStyle}>Food name</p>
            <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} style={{ ...selectStyle, width: "100%", padding: 10, marginBottom: 10 }} placeholder="e.g. Wholegrain bread" />

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div><p style={labelStyle}>Category</p>
                <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} style={{ ...selectStyle, width: "100%", padding: 9 }}>
                  {["Fruit", "Bread", "Breakfast food", "Canned food", "Dairy", "Other"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div><p style={labelStyle}>Source</p>
                <select value={draft.source} onChange={(e) => setDraft({ ...draft, source: e.target.value })} style={{ ...selectStyle, width: "100%", padding: 9 }}>
                  {["Canteen", "School lunch provider", "School event", "Household", "Garden", "Approved local partner"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
              <div><p style={labelStyle}>Quantity</p>
                <input type="number" min={1} value={draft.qty} onChange={(e) => setDraft({ ...draft, qty: +e.target.value })} style={{ ...selectStyle, width: "100%", padding: 9 }} /></div>
              <div><p style={labelStyle}>Unit</p>
                <input value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })} style={{ ...selectStyle, width: "100%", padding: 9 }} /></div>
              <div><p style={labelStyle}>Weight (kg)</p>
                <input type="number" step="0.1" value={draft.weightKg} onChange={(e) => setDraft({ ...draft, weightKg: +e.target.value })} style={{ ...selectStyle, width: "100%", padding: 9 }} /></div>
            </div>

            <p style={labelStyle}>Donation type</p>
            <div className="flex gap-2 mb-2">
              {["Rescued Surplus", "Regular Donation"].map((t) => (
                <button key={t} onClick={() => setDraft({ ...draft, type: t })} style={{ ...selectStyle, flex: 1, background: draft.type === t ? C.gold : "#fff" }}>{t}</button>
              ))}
            </div>
            {draft.type === "Rescued Surplus" && (
              <>
                <p style={labelStyle}>Reason it would otherwise have been wasted</p>
                <input value={draft.reason} onChange={(e) => setDraft({ ...draft, reason: e.target.value })} style={{ ...selectStyle, width: "100%", padding: 9, marginBottom: 10 }} placeholder="e.g. surplus from canteen lunch service" />
              </>
            )}

            <p style={labelStyle}>Perishable?</p>
            <div className="flex gap-2 mb-2">
              {[true, false].map((b) => (
                <button key={String(b)} onClick={() => setDraft({ ...draft, perishable: b })} style={{ ...selectStyle, flex: 1, background: draft.perishable === b ? C.gold : "#fff" }}>{b ? "Perishable" : "Non-perishable"}</button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-2">
              <div><p style={labelStyle}>Best-before date</p><input value={draft.bestBefore} onChange={(e) => setDraft({ ...draft, bestBefore: e.target.value })} style={{ ...selectStyle, width: "100%", padding: 9 }} placeholder="Optional" /></div>
              <div><p style={labelStyle}>Use-by date</p><input value={draft.useBy} onChange={(e) => setDraft({ ...draft, useBy: e.target.value })} style={{ ...selectStyle, width: "100%", padding: 9 }} placeholder="Optional" /></div>
            </div>
            <p style={labelStyle}>Labelled allergens</p>
            <input value={draft.allergens} onChange={(e) => setDraft({ ...draft, allergens: e.target.value })} style={{ ...selectStyle, width: "100%", padding: 9, marginBottom: 10 }} placeholder="e.g. Gluten, Dairy" />
            <p style={labelStyle}>Storage location</p>
            <input value={draft.storage} onChange={(e) => setDraft({ ...draft, storage: e.target.value })} style={{ ...selectStyle, width: "100%", padding: 9, marginBottom: 10 }} />

            <button onClick={() => setDraft({ ...draft, photo: !draft.photo })} className="flex items-center gap-2 mb-4" style={{ ...selectStyle, width: "100%", justifyContent: "center" }}>
              <Camera size={14} /> {draft.photo ? "Label photo attached" : "Attach label photograph (optional)"}
            </button>

            <div className="p-3 rounded-xl mb-4" style={{ background: C.creamDeep }}>
              <p style={{ ...labelStyle, marginBottom: 8 }}>Acceptance checklist</p>
              {checklistItems.map((c) => (
                <label key={c} className="flex items-start gap-2 mb-2 cursor-pointer">
                  <input type="checkbox" checked={!!checklist[c]} onChange={(e) => setChecklist({ ...checklist, [c]: e.target.checked })} style={{ marginTop: 3 }} />
                  <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.forest }}>{c}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <Button full disabled={!draft.name || !allChecked} onClick={() => {
                addIntakeItem({
                  name: draft.name, qty: draft.qty, unit: draft.unit, category: draft.category, perishable: draft.perishable,
                  type: draft.type, deadline: draft.useBy || draft.bestBefore || "Check with volunteer",
                  allergens: draft.allergens ? draft.allergens.split(",").map((a) => a.trim()) : [],
                  status: "Available", urgency: "green", weightKg: draft.weightKg, source: draft.source,
                  storageLocation: draft.storage, receivedAt: "Just now",
                });
                resetDraft(); setChecklist({});
              }}>Accept &amp; add to pantry</Button>
              <Button variant="danger" onClick={() => { referItem(draft); }}>Refer to Teacher Coordinator</Button>
            </div>
            {!allChecked && <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.forestSoft, marginTop: 8 }}>Complete the checklist to accept this item. If you're uncertain, refer it instead.</p>}
          </Card>
        )}

        {tab === "inventory" && (
          <div className="flex flex-col gap-2.5">
            {inventory.map((item) => (
              <Card key={item.id} style={{ padding: 13 }}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.forest }}>{item.name}</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.forestSoft }}>{item.category} · last checked {item.lastChecked}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => updateItem(item.id, { qty: Math.max(0, item.qty - 1), status: item.qty - 1 <= 0 ? "Out of Stock" : item.qty - 1 <= 2 ? "Low Stock" : "Available" })} style={iconBtn}><Minus size={13} /></button>
                    <span style={{ fontFamily: FONT_BODY, fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => updateItem(item.id, { qty: item.qty + 1, status: "Available" })} style={iconBtn}><Plus size={13} /></button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <Pill bg={item.status === "Out of Stock" ? C.red : item.status === "Low Stock" ? C.amber : C.green} fg="#fff">{item.status}</Pill>
                  {["Collected", "Transferred", "Composted"].map((action) => (
                    <button key={action} onClick={() => { updateItem(item.id, { status: action === "Collected" ? "Out of Stock" : item.status }); addLog(`${item.name} marked as ${action.toLowerCase()}.`, "rescue"); showToast(`Marked ${action.toLowerCase()}.`); }}
                      style={{ ...selectStyle, padding: "4px 9px", fontSize: 11 }}>{action}</button>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {tab === "requests" && (
          <div className="flex flex-col gap-2.5">
            <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.forestSoft, marginBottom: 4 }}>Aggregated totals only — no student identities are ever visible.</p>
            {requestGroups.map((g) => (
              <Card key={g.category} style={{ padding: 12 }}>
                <div className="flex justify-between items-center">
                  <span style={{ fontFamily: FONT_BODY, fontWeight: 700, color: C.forest }}>{g.category}</span>
                  <Pill bg={C.gold}>{g.count}</Pill>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  const iconBtn = { background: C.creamDeep, borderRadius: 999, width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center" };

  /* ---------------------------------- PAGE: teacher dashboard ---------------------------------- */
  function TeacherDashboard() {
    if (session?.role !== "teacher") return <LoginGate />;
    const [tab, setTab] = useState("approvals");
    return (
      <div>
        <SectionTitle sub="Full pantry oversight, analytics and privacy controls.">Teacher Dashboard</SectionTitle>
        <div className="flex gap-2 mb-4 flex-wrap">
          {[["approvals", "Approvals & Referrals"], ["analytics", "Analytics"], ["privacy", "Privacy & Export"]].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{ ...selectStyle, background: tab === k ? C.forest : "#fff", color: tab === k ? "#fff" : C.forest }}>{l}</button>
          ))}
        </div>

        {tab === "approvals" && (
          <div className="flex flex-col gap-4">
            <div>
              <p style={labelStyle}>Volunteer account approvals</p>
              <div className="flex flex-col gap-2">
                {volunteers.length === 0 && <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.forestSoft }}>No pending accounts.</p>}
                {volunteers.map((v) => (
                  <Card key={v.id} style={{ padding: 12 }}>
                    <div className="flex justify-between items-center">
                      <span style={{ fontFamily: FONT_BODY, fontWeight: 600, color: C.forest, fontSize: 13.5 }}>{v.name}</span>
                      <div className="flex gap-2">
                        <Button style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => { setVolunteers((vs) => vs.filter((x) => x.id !== v.id)); showToast("Volunteer approved."); }}>Approve</Button>
                        <Button variant="ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => { setVolunteers((vs) => vs.filter((x) => x.id !== v.id)); showToast("Volunteer declined.", "error"); }}>Decline</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <p style={labelStyle}>Uncertain donations referred by volunteers</p>
              <div className="flex flex-col gap-2">
                {referred.length === 0 && <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.forestSoft }}>Nothing referred right now.</p>}
                {referred.map((r) => (
                  <Card key={r.id} style={{ padding: 12 }}>
                    <p style={{ fontFamily: FONT_BODY, fontWeight: 600, color: C.forest, fontSize: 13.5 }}>{r.name || "Unnamed item"}</p>
                    <p style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.forestSoft }}>{r.source} · {r.category}</p>
                    <div className="flex gap-2 mt-2">
                      <Button style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => { addIntakeItem({ name: r.name || "Referred item", qty: r.qty || 1, unit: r.unit || "items", category: r.category, perishable: r.perishable, type: r.type, deadline: r.useBy || "Check", allergens: [], status: "Available", urgency: "amber", weightKg: r.weightKg || 0.3, source: r.source, storageLocation: r.storage, receivedAt: "Just now" }); setReferred((rs) => rs.filter((x) => x.id !== r.id)); }}>Approve</Button>
                      <Button variant="ghost" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => { setReferred((rs) => rs.filter((x) => x.id !== r.id)); showToast("Referral rejected.", "error"); }}>Reject</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="flex flex-col gap-3">
            <Card style={{ padding: 14 }}>
              <p style={labelStyle}>Request vs supply (this week)</p>
              {requestGroups.map((g) => {
                const supplied = inventory.filter((i) => i.category === g.category).reduce((s, i) => s + i.qty, 0);
                const pct = Math.min(100, Math.round((supplied / g.count) * 100));
                return (
                  <div key={g.category} className="mb-2.5">
                    <div className="flex justify-between mb-1">
                      <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.forest, fontWeight: 600 }}>{g.category}</span>
                      <span style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.forestSoft }}>{supplied} supplied / {g.count} requested</span>
                    </div>
                    <div style={{ height: 8, borderRadius: 999, background: C.creamDeep, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: pct < 50 ? C.red : pct < 90 ? C.amber : C.green }} />
                    </div>
                  </div>
                );
              })}
            </Card>
            <Card style={{ padding: 14 }}>
              <p style={labelStyle}>AI demand forecast</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.forest }}>Breakfast food and bread are forecast to remain the highest-demand categories next week. Consider prompting canteen surplus donations before 8:30am.</p>
            </Card>
          </div>
        )}

        {tab === "privacy" && (
          <div className="flex flex-col gap-3">
            <Card style={{ padding: 14 }}>
              <p style={labelStyle}>Data retention</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.forestSoft, marginBottom: 10 }}>Individual requests are deleted after fulfilment or after 30 days. Only anonymous totals are retained for reporting.</p>
              <Button variant="outline" onClick={() => showToast("Retention settings saved.")}>Confirm 30-day retention policy</Button>
            </Card>
            <Card style={{ padding: 14 }}>
              <p style={labelStyle}>Data export</p>
              <Button variant="outline" onClick={() => showToast("Anonymised report exported.")}><span className="flex items-center gap-2"><FileDown size={14} /> Export anonymised analytics</span></Button>
            </Card>
          </div>
        )}
      </div>
    );
  }

  /* ---------------------------------- PAGE: photo analysis (AI scanning engine) ---------------------------------- */
  function PhotoAnalysisPage() {
    if (!session) return <LoginGate />;
    const canEdit = session.role === "volunteer" || session.role === "teacher";
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState("");
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null);
    const [desc, setDesc] = useState("");

    const resetScan = () => { setPreview(null); setFileName(""); setScanResult(null); setDesc(""); };

    const handleFile = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      resetScan();
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
    };

    const runAiScan = () => {
      setScanning(true);
      setScanResult(null);
      setTimeout(() => {
        const flagged = Math.random() < 0.12;
        if (flagged) {
          setScanResult({ flagged: true, reason: moderationRejections[Math.floor(Math.random() * moderationRejections.length)] });
        } else {
          const pick = mockScanResults[Math.floor(Math.random() * mockScanResults.length)];
          const desc = `${pick.name} — ${pick.qty}, ${pick.weightEstimate}. Estimated safe window: ~${pick.shelfLifeHours} hours.${pick.spoil ? " " + pick.spoil.note : ""}`;
          setScanResult({ flagged: false, ...pick, description: desc });
          setDesc(desc);
        }
        setScanning(false);
      }, 1300);
    };

    const unsafe = scanResult && !scanResult.flagged && scanResult.spoil?.level === "red";

    const publishItem = () => {
      addIntakeItem({
        name: scanResult.name, qty: parseInt(scanResult.qty, 10) || 1, unit: "items",
        category: scanResult.category, perishable: true, type: "Rescued Surplus",
        deadline: `Safe for ~${scanResult.shelfLifeHours} hours`, allergens: [],
        status: "Available", urgency: scanResult.spoil?.level || "green", weightKg: 0.3,
        source: "AI-scanned donation", storageLocation: "Pantry", receivedAt: "Just now",
      });
      resetScan();
    };

    const submitForReview = () => {
      referItem({
        name: scanResult.name, qty: parseInt(scanResult.qty, 10) || 1, unit: "items",
        category: scanResult.category, perishable: true, type: "Rescued Surplus",
        useBy: `Safe for ~${scanResult.shelfLifeHours} hours`, weightKg: 0.3,
        source: "AI-scanned donation (student submitted)", storage: "Pantry",
      });
      resetScan();
    };

    const logAsWaste = () => {
      addLog(`${scanResult.name} was flagged unsafe by AI scan and composted instead of published.`, "rescue");
      showToast("Logged as waste — not published to the pantry.");
      resetScan();
    };

    return (
      <div>
        <SectionTitle sub="Capture or upload a photo and AI will identify the item, estimate quantity and shelf life.">Photo Analysis</SectionTitle>

        <Card style={{ padding: 16, marginBottom: 14 }}>
          {preview ? (
            <div className="flex flex-col items-center">
              <img src={preview} alt={fileName} style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 14, marginBottom: 10 }} />
              <p style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.forestSoft, marginBottom: 10 }}>{fileName}</p>
              <div className="flex gap-2 w-full">
                <Button full variant="outline" onClick={resetScan}>Retake / choose another</Button>
                {!scanResult && (
                  <Button full disabled={scanning} onClick={runAiScan}>
                    {scanning ? "Analyzing..." : <span className="flex items-center justify-center gap-2"><ScanLine size={15} /> Analyze photo</span>}
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 text-center">
              <div style={{ background: C.sageLight, borderRadius: 999, padding: 16, marginBottom: 10 }}>
                <Camera size={26} style={{ color: C.forest }} />
              </div>
              <p style={{ fontFamily: FONT_BODY, color: C.forestSoft, fontSize: 12.5, marginBottom: 14 }}>Take a clear photo of the food item, or upload one from your gallery.</p>
              <div className="flex gap-2 w-full">
                <label className="flex-1">
                  <input type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: "none" }} />
                  <span style={{ ...selectStyle, width: "100%", padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: C.forest, color: C.paper, cursor: "pointer" }}>
                    <Camera size={14} /> Take photo
                  </span>
                </label>
                <label className="flex-1">
                  <input type="file" accept="image/*" onChange={handleFile} style={{ display: "none" }} />
                  <span style={{ ...selectStyle, width: "100%", padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}>
                    <Upload size={14} /> Upload photo
                  </span>
                </label>
              </div>
            </div>
          )}
        </Card>

        {scanning && (
          <Card style={{ padding: 16, marginBottom: 14, textAlign: "center" }} bg={C.sageLight}>
            <Sparkles size={20} style={{ color: C.forest, margin: "0 auto 6px" }} />
            <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.forest, fontWeight: 600 }}>AI vision is checking for food content, estimating quantity and shelf life...</p>
          </Card>
        )}

        {scanResult?.flagged && (
          <Card style={{ padding: 16, marginBottom: 14 }} bg={C.red}>
            <p className="flex items-start gap-2" style={{ fontFamily: FONT_BODY, color: "#fff", fontWeight: 700, fontSize: 13.5, marginBottom: 4 }}>
              <ImageOff size={17} style={{ flexShrink: 0, marginTop: 1 }} /> Upload rejected
            </p>
            <p style={{ fontFamily: FONT_BODY, color: "#fff", fontSize: 12.5 }}>{scanResult.reason} Please retake the photo, making sure the food item is clearly visible.</p>
          </Card>
        )}

        {scanResult && !scanResult.flagged && (
          <>
            <Card style={{ padding: 16, marginBottom: 14 }}>
              <p style={labelStyle}>AI analysis</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <Card style={{ padding: 10 }} bg={C.creamDeep}>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: C.forestSoft }}>Item identification</p>
                  <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.forest, fontSize: 15 }}>{scanResult.name}</p>
                </Card>
                <Card style={{ padding: 10 }} bg={C.creamDeep}>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: C.forestSoft }}>Quantity estimate</p>
                  <p style={{ fontFamily: FONT_BODY, fontWeight: 700, color: C.forest, fontSize: 13.5 }}>{scanResult.qty}</p>
                  <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.forestSoft }}>{scanResult.weightEstimate}</p>
                </Card>
              </div>
              <div className="flex items-center gap-2 mb-2 p-2.5 rounded-xl" style={{ background: C.sageLight }}>
                <Clock size={16} style={{ color: C.forest, flexShrink: 0 }} />
                <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.forest, fontWeight: 600 }}>Safe for ~{scanResult.shelfLifeHours} hours</span>
              </div>
              {scanResult.spoil ? (
                <div className="flex items-start gap-2 p-2.5 rounded-xl" style={{ background: scanResult.spoil.level === "red" ? C.red : C.amber }}>
                  <AlertTriangle size={16} style={{ color: "#fff", flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "#fff", fontWeight: 600 }}>{scanResult.spoil.note}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: C.green }}>
                  <CheckCircle2 size={16} style={{ color: "#fff", flexShrink: 0 }} />
                  <span style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: "#fff", fontWeight: 600 }}>No mould, bruising or decay detected.</span>
                </div>
              )}
            </Card>

            <Card style={{ padding: 16, marginBottom: 14 }}>
              <div className="flex items-center justify-between mb-2">
                <p style={{ ...labelStyle, marginBottom: 0 }}>Description</p>
                {!canEdit && (
                  <span className="flex items-center gap-1" style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: C.forestSoft, fontWeight: 700 }}>
                    <Lock size={11} /> Read-only
                  </span>
                )}
              </div>
              <textarea
                value={desc}
                onChange={(e) => canEdit && setDesc(e.target.value)}
                readOnly={!canEdit}
                rows={3}
                style={{ ...selectStyle, width: "100%", padding: 10, resize: "none", background: canEdit ? "#fff" : C.creamDeep, color: C.forest }}
              />
              <p style={{ fontFamily: FONT_BODY, fontSize: 11, color: C.forestSoft, marginTop: 6 }}>
                {canEdit
                  ? "As Staff/Admin, you can edit or override any AI-generated value before publishing."
                  : "Only authenticated Staff and Admin accounts can edit AI-generated values. Your scan will be sent for review before it's published."}
              </p>
            </Card>

            {unsafe ? (
              <Card style={{ padding: 14 }} bg={C.creamDeep}>
                <p style={{ fontFamily: FONT_BODY, fontSize: 12.5, color: C.forest, marginBottom: 10 }}>This item has been flagged as unsafe for consumption and can't be published to the pantry.</p>
                <Button full variant="danger" onClick={logAsWaste}>Log as waste / composted</Button>
              </Card>
            ) : canEdit ? (
              <Button full onClick={publishItem}>Publish to Live Pantry</Button>
            ) : (
              <Button full onClick={submitForReview}>Submit for volunteer review</Button>
            )}
          </>
        )}

        <Card style={{ padding: 14, marginTop: 14, background: C.blue, border: "none" }}>
          <p className="flex items-start gap-2" style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.forest }}>
            <ShieldAlert size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            AI automatically checks every photo and rejects images that aren't food, or that appear inappropriate or suspicious.
          </p>
        </Card>
      </div>
    );
  }

  /* ---------------------------------- PAGE: chat (structured reservation) ---------------------------------- */
  function ChatBubble({ from, children }) {
    const isAi = from === "ai";
    return (
      <div className={`flex ${isAi ? "justify-start" : "justify-end"} mb-2.5`}>
        <div
          style={{
            maxWidth: "85%", padding: "10px 14px", borderRadius: isAi ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
            background: isAi ? C.sageLight : C.forest, color: isAi ? C.forest : C.paper,
            fontFamily: FONT_BODY, fontSize: 13.5,
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  function ChatPage() {
    if (!session) return <LoginGate />;
    if (!chatItem) {
      return (
        <Card style={{ padding: 26, textAlign: "center" }}>
          <MessageCircle size={26} style={{ color: C.forestSoft, margin: "0 auto 10px" }} />
          <p style={{ fontFamily: FONT_BODY, color: C.forest, fontWeight: 700, marginBottom: 4 }}>No item selected</p>
          <p style={{ fontFamily: FONT_BODY, color: C.forestSoft, fontSize: 13, marginBottom: 14 }}>Head back to the Live Pantry and tap an item to start a reservation chat.</p>
          <Button onClick={() => goto("pantry")}>Go to Live Pantry</Button>
        </Card>
      );
    }

    const item = chatItem;
    const [step, setStep] = useState(0);
    const [location, setLocation] = useState(EXCHANGE_LOCATIONS[0]);
    const [date, setDate] = useState("Today");
    const [time, setTime] = useState(CHAT_TIME_SLOTS[0]);
    const [cancelled, setCancelled] = useState(false);

    if (cancelled) {
      return (
        <div>
          <SectionTitle sub="Structured reservation chat.">Chat</SectionTitle>
          <Card style={{ padding: 22, textAlign: "center" }}>
            <ThumbsDown size={22} style={{ color: C.forestSoft, margin: "0 auto 10px" }} />
            <p style={{ fontFamily: FONT_BODY, color: C.forest, fontWeight: 700, marginBottom: 4 }}>Reservation cancelled</p>
            <p style={{ fontFamily: FONT_BODY, color: C.forestSoft, fontSize: 13, marginBottom: 14 }}>No problem — {item.name} stays in the Live Pantry for other students to collect.</p>
            <Button onClick={() => { setChatItem(null); goto("pantry"); }}>Back to Live Pantry</Button>
          </Card>
        </div>
      );
    }

    return (
      <div>
        <SectionTitle sub="A guided, template-only chat — no free text, so every exchange stays safe and predictable.">Reserve: {item.name}</SectionTitle>

        <Card style={{ padding: 12, marginBottom: 14, background: C.blue, border: "none" }}>
          <p className="flex items-start gap-2" style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.forest }}>
            <ShieldAlert size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            AI Chat Moderation: only the structured responses below are available. Custom free-text messaging is disabled.
          </p>
        </Card>

        <div className="mb-3">
          <ChatBubble from="ai">
            Kia ora! Can you confirm this is the Kai you want: <strong>{item.name}</strong> (~{item.qty} {item.unit})?
          </ChatBubble>
          {step >= 1 && <ChatBubble from="user">Yes, that's the one.</ChatBubble>}
        </div>

        {step === 0 && (
          <Card style={{ padding: 14 }}>
            <div className="flex gap-2">
              <Button full onClick={() => setStep(1)}><span className="flex items-center justify-center gap-1.5"><ThumbsUp size={14} /> Yes</span></Button>
              <Button full variant="ghost" onClick={() => setCancelled(true)}><span className="flex items-center justify-center gap-1.5"><ThumbsDown size={14} /> No</span></Button>
            </div>
          </Card>
        )}

        {step >= 1 && (
          <div className="mb-3">
            <ChatBubble from="ai">Great — address request: which designated school exchange location works for pickup?</ChatBubble>
            {step >= 2 && <ChatBubble from="user">{location}</ChatBubble>}
          </div>
        )}

        {step === 1 && (
          <Card style={{ padding: 14 }}>
            <div className="flex flex-col gap-2 mb-3">
              {EXCHANGE_LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className="flex items-center gap-2"
                  style={{ ...selectStyle, width: "100%", padding: "9px 12px", justifyContent: "flex-start", background: location === loc ? C.gold : "#fff" }}
                >
                  <MapPin size={14} /> {loc}
                </button>
              ))}
            </div>
            <Button full onClick={() => setStep(2)}>Confirm location</Button>
          </Card>
        )}

        {step >= 2 && (
          <div className="mb-3">
            <ChatBubble from="ai">Time request: what date and pickup time suit you?</ChatBubble>
            {step >= 3 && <ChatBubble from="user">{date} at {time}</ChatBubble>}
          </div>
        )}

        {step === 2 && (
          <Card style={{ padding: 14 }}>
            <p style={labelStyle}>Date</p>
            <div className="flex gap-2 mb-3">
              {["Today", "Tomorrow"].map((d) => (
                <button key={d} onClick={() => setDate(d)} style={{ ...selectStyle, flex: 1, background: date === d ? C.gold : "#fff" }}>{d}</button>
              ))}
            </div>
            <p style={labelStyle}>Pickup time</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {CHAT_TIME_SLOTS.map((t) => (
                <button key={t} onClick={() => setTime(t)} style={{ ...selectStyle, background: time === t ? C.gold : "#fff" }}>{t}</button>
              ))}
            </div>
            <Button full onClick={() => setStep(3)}>Confirm time</Button>
          </Card>
        )}

        {step >= 3 && (
          <div className="mb-3">
            <ChatBubble from="ai">
              Confirm reservation: <strong>{item.name}</strong> · {location} · {date} at {time}. Shall I confirm this reservation?
            </ChatBubble>
          </div>
        )}

        {step === 3 && (
          <Card style={{ padding: 14 }}>
            <div className="flex gap-2">
              <Button full onClick={() => confirmReservation({ item, location, date, time })}>
                <span className="flex items-center justify-center gap-1.5"><ThumbsUp size={14} /> Confirm reservation</span>
              </Button>
              <Button full variant="ghost" onClick={() => setCancelled(true)}>
                <span className="flex items-center justify-center gap-1.5"><ThumbsDown size={14} /> No</span>
              </Button>
            </div>
          </Card>
        )}
      </div>
    );
  }

  /* ---------------------------------- PAGE: review & tracker ---------------------------------- */
  function TrackerPage() {
    if (!session) return <LoginGate />;
    if (!reservation) {
      return (
        <Card style={{ padding: 26, textAlign: "center" }}>
          <Timer size={26} style={{ color: C.forestSoft, margin: "0 auto 10px" }} />
          <p style={{ fontFamily: FONT_BODY, color: C.forest, fontWeight: 700, marginBottom: 4 }}>No active reservation</p>
          <p style={{ fontFamily: FONT_BODY, color: C.forestSoft, fontSize: 13, marginBottom: 14 }}>Reserve an item from the Live Pantry to see its pickup tracker here.</p>
          <Button onClick={() => goto("pantry")}>Go to Live Pantry</Button>
        </Card>
      );
    }

    const target = useMemo(() => {
      const now = new Date();
      const [h, m] = reservation.time.split(":").map(Number);
      const t = new Date(now);
      t.setHours(h, m, 0, 0);
      if (reservation.date === "Tomorrow" || t < now) t.setDate(t.getDate() + (reservation.date === "Tomorrow" ? 1 : 1));
      return t;
    }, [reservation]);

    const [remaining, setRemaining] = useState(target.getTime() - Date.now());

    React.useEffect(() => {
      const iv = setInterval(() => setRemaining(target.getTime() - Date.now()), 1000);
      return () => clearInterval(iv);
    }, [target]);

    React.useEffect(() => {
      if (remaining <= 0) {
        const t = setTimeout(() => completePickup(true), 300);
        return () => clearTimeout(t);
      }
    }, [remaining <= 0]);

    const clamped = Math.max(0, remaining);
    const hh = String(Math.floor(clamped / 3600000)).padStart(2, "0");
    const mm = String(Math.floor((clamped % 3600000) / 60000)).padStart(2, "0");
    const ss = String(Math.floor((clamped % 60000) / 1000)).padStart(2, "0");
    const Icon = iconFor(reservation.item.name);

    return (
      <div>
        <SectionTitle sub="Your reservation is confirmed — here's when and where to collect it.">Pickup Tracker</SectionTitle>

        <Card style={{ padding: 18, marginBottom: 14, textAlign: "center" }} bg={C.forest}>
          <p className="flex items-center justify-center gap-1.5" style={{ fontFamily: FONT_BODY, fontSize: 11.5, color: C.sageLight, fontWeight: 700, marginBottom: 6 }}>
            <Hourglass size={13} /> Time until pickup
          </p>
          <p style={{ fontFamily: FONT_DISPLAY, fontSize: 40, fontWeight: 700, color: C.paper, letterSpacing: 1 }}>{hh}:{mm}:{ss}</p>
        </Card>

        <Card style={{ padding: 16, marginBottom: 12 }}>
          <div className="flex items-center gap-3 mb-3">
            <div style={{ background: C.sageLight, borderRadius: 999, padding: 10 }}>
              <Icon size={22} style={{ color: C.forest }} />
            </div>
            <div>
              <p style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, color: C.forest, fontSize: 17 }}>{reservation.item.name}</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.forestSoft }}>Reserved under account code {reservation.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-2 p-2.5 rounded-xl" style={{ background: C.creamDeep }}>
            <CalendarDays size={16} style={{ color: C.forest, flexShrink: 0 }} />
            <span style={{ fontFamily: FONT_BODY, fontSize: 13, color: C.forest, fontWeight: 600 }}>{reservation.date} at {reservation.time}</span>
          </div>
          <div
            className="flex items-center gap-2 p-3 rounded-xl"
            style={{
              background: `repeating-linear-gradient(45deg, ${C.sageLight}, ${C.sageLight} 10px, ${C.creamDeep} 10px, ${C.creamDeep} 20px)`,
            }}
          >
            <div style={{ background: "#fff", borderRadius: 999, padding: 8, flexShrink: 0 }}>
              <MapPin size={18} style={{ color: C.red }} />
            </div>
            <div>
              <p style={{ fontFamily: FONT_BODY, fontSize: 10.5, color: C.forest, fontWeight: 700 }}>Exchange location</p>
              <p style={{ fontFamily: FONT_BODY, fontSize: 13.5, color: C.forest, fontWeight: 700 }}>{reservation.location}</p>
            </div>
          </div>
        </Card>

        <Button full onClick={() => completePickup(false)}>Mark as collected</Button>

        <Card style={{ padding: 14, marginTop: 12, background: C.blue, border: "none" }}>
          <p className="flex items-start gap-2" style={{ fontFamily: FONT_BODY, fontSize: 12, color: C.forest }}>
            <ShieldCheck size={15} style={{ flexShrink: 0, marginTop: 1 }} />
            When the countdown reaches zero, or once you mark this collected, you'll be returned to the Live Pantry automatically.
          </p>
        </Card>
      </div>
    );
  }

  /* ---------------------------------- router ---------------------------------- */
  if (page === "login" && !session) return <LoginPage />;

  let body;
  switch (page) {
    case "pantry": body = <PantryPage />; break;
    case "communitylog": body = <CommunityLogPage />; break;
    case "request": body = <RequestPage />; break;
    case "requestslist": body = <RequestsListPage />; break;
    case "achievements": body = <AchievementsPage />; break;
    case "personal": body = <PersonalPage />; break;
    case "week": body = <ReportsPage which="week" />; break;
    case "month": body = <ReportsPage which="month" />; break;
    case "archive": body = <ReportsPage which="archive" />; break;
    case "notif": body = <NotifPage />; break;
    case "scan": body = <PhotoAnalysisPage />; break;
    case "chat": body = <ChatPage />; break;
    case "tracker": body = <TrackerPage />; break;
    case "volunteer": body = <VolunteerDashboard />; break;
    case "teacher": body = <TeacherDashboard />; break;
    case "login": body = <LoginGate />; break;
    default: body = <PantryPage />;
  }

  return <Shell>{body}</Shell>;
}
