import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Sparkles,
  Shield,
  LogOut,
  BookOpen,
  FileText,
  Scroll,
  Download,
} from "lucide-react";
import { useResources } from "./data/useResources";
import ResourceCard from "./components/ResourceCard";
import AddResourceModal from "./components/AddResourceModal";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { Analytics } from "@vercel/analytics/react";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "book", label: "Books" },
  { key: "notes", label: "Notes" },
  { key: "paper", label: "Papers" },
];

function AdminLoginPage({ onBack }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !pass || loading) return;
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      setError("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center p-5">
      <div className="bg-[#1e1e38] border border-white/10 rounded-2xl p-8 w-full max-w-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center mx-auto mb-5">
          <Shield size={24} className="text-[#e8c77d]" />
        </div>
        <h2 className="text-2xl font-extrabold mb-1.5">Admin Panel</h2>
        <p className="text-sm text-white/30 mb-7">Authorized access only</p>

        <input
          type="email"
          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-3.5 text-center text-white text-base outline-none focus:border-[#e8c77d] transition-colors mb-2 placeholder-white/20"
          placeholder="admin@studyhub.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
          autoFocus
        />
        <input
          type="password"
          className="w-full bg-[#0d0d1a] border border-white/10 rounded-xl px-4 py-3.5 text-center text-white text-base tracking-widest outline-none focus:border-[#e8c77d] transition-colors mb-2 placeholder-white/20"
          placeholder="••••••••••••"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-[#e8c77d] hover:bg-[#f5d898] text-[#1a1410] font-extrabold text-base transition-colors mt-2 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={onBack}
          className="text-white/25 text-sm mt-5 hover:text-white/50 transition-colors underline bg-transparent border-none cursor-pointer"
        >
          Go back
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const { resources, addResource, incrementDownload, deleteResource, loaded } =
    useResources();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setIsAdmin(!!user);
      if (user) {
        setShowAdminLogin(false);
        if (window.location.pathname.startsWith("/admin")) {
          window.history.replaceState({}, "", "/");
        }
      }
    });

    const path = window.location.pathname;
    if (path === "/admin" || path === "/admin/") {
      setShowAdminLogin(true);
    }

    return () => unsub();
  }, []);

  const filtered = useMemo(
    () =>
      resources.filter((r) => {
        const matchType = filter === "all" || r.type === filter;
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          r.title?.toLowerCase().includes(q) ||
          r.subject?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.tags?.some((t) => t.includes(q)) ||
          r.addedBy?.toLowerCase().includes(q);
        return matchType && matchSearch;
      }),
    [resources, filter, search],
  );

  const stats = useMemo(
    () => ({
      total: resources.length,
      books: resources.filter((r) => r.type === "book").length,
      notes: resources.filter((r) => r.type === "notes").length,
      papers: resources.filter((r) => r.type === "paper").length,
      downloads: resources.reduce((s, r) => s + (r.downloads || 0), 0),
    }),
    [resources],
  );

  if (showAdminLogin && !isAdmin)
    return (
      <AdminLoginPage
        onBack={() => {
          setShowAdminLogin(false);
          window.history.replaceState({}, "", "/");
        }}
      />
    );

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-white">
      {showModal && (
        <AddResourceModal
          onClose={() => setShowModal(false)}
          onAdd={addResource}
        />
      )}

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0d0d1a]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#e8c77d] rounded-xl flex items-center justify-center font-extrabold text-[#1a1410] text-lg font-syne">
              S
            </div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight font-syne">
              Study<span className="text-[#e8c77d]">Hub</span>
            </span>
          </div>

          {/* Desktop actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {isAdmin && (
              <>
                <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#e8c77d] bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full">
                  <Shield size={10} /> ADMIN
                </span>
                <button
                  onClick={() => signOut(auth)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white text-sm transition-colors"
                >
                  <LogOut size={13} /> Logout
                </button>
              </>
            )}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#e8c77d] hover:bg-[#f5d898] text-[#1a1410] font-bold text-sm transition-colors"
            >
              <Plus size={15} /> Add Resource
            </button>
          </div>

          {/* Mobile add button */}
          <button
            onClick={() => setShowModal(true)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#e8c77d] hover:bg-[#f5d898] text-[#1a1410] font-bold text-sm transition-colors"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-10 text-center">
        <div className="inline-flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-4 py-1.5 mb-6">
          <Sparkles size={12} className="text-[#e8c77d]" />
          <span className="text-xs text-[#e8c77d] font-bold tracking-widest uppercase">
            Free Knowledge Sharing
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4 font-syne">
          Share your knowledge
          <br />
          <span className="bg-gradient-to-r from-[#e8c77d] to-[#5dd6c4] bg-clip-text text-transparent">
            with everyone
          </span>
        </h1>

        <p className="text-base sm:text-lg text-white/50 max-w-md mx-auto mb-8 sm:mb-10 leading-relaxed">
          Books, notes, past papers paste a Google Drive link and share with
          the world. No account needed.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-xl mx-auto mb-8 sm:mb-12">
          {[
            {
              label: "Resources",
              val: stats.total,
              color: "text-[#e8c77d]",
              icon: BookOpen,
            },
            {
              label: "Books",
              val: stats.books,
              color: "text-[#5dd6c4]",
              icon: BookOpen,
            },
            {
              label: "Notes",
              val: stats.notes,
              color: "text-[#a78bfa]",
              icon: FileText,
            },
            {
              label: "Downloads",
              val: stats.downloads,
              color: "text-emerald-400",
              icon: Download,
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[#1e1e38] border border-white/[0.07] rounded-xl p-3 sm:p-4"
            >
              <p
                className={`text-2xl sm:text-3xl font-extrabold font-syne ${s.color}`}
              >
                {s.val}
              </p>
              <p className="text-[11px] text-white/30 uppercase tracking-widest mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-lg mx-auto">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            className="w-full bg-[#1e1e38] border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm sm:text-base placeholder-white/25 outline-none focus:border-[#e8c77d] transition-colors"
            placeholder="Search books, subjects, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* ── Filters ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border
                ${
                  filter === f.key
                    ? "bg-[#e8c77d] border-[#e8c77d] text-[#1a1410]"
                    : "bg-[#1e1e38] border-white/[0.07] text-white/50 hover:border-white/20 hover:text-white/80"
                }`}
            >
              {f.label}
            </button>
          ))}
          <span className="ml-auto text-xs text-white/25">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ── Grid ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {!loaded ? (
          <div className="text-center py-20 text-white/30 text-sm">
            Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📚</p>
            <p className="text-white/50 text-lg mb-2">No resources found</p>
            <p className="text-white/25 text-sm">
              Try a different search or add something new
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r) => (
              <ResourceCard
                key={r.id}
                resource={r}
                onDownload={incrementDownload}
                onDelete={deleteResource}
                isAdmin={isAdmin}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.07] py-6 text-center">
        <p className="text-xs text-white/20 flex items-center justify-center gap-1">
          StudyHub Sharing knowledge is
          {/* Charity Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3 h-3 text-white/30"
          >
            <path d="M12 21s-6.716-4.35-9.428-7.062C.86 12.226 1.2 9.28 3.515 7.965c1.675-.945 3.74-.36 4.985 1.065C9.745 7.605 11.81 7.02 13.485 7.965c2.315 1.315 2.655 4.261.943 5.973C18.716 16.65 12 21 12 21z" />
          </svg>
          charity
        </p>

        {!isAdmin && (
          <button
            onClick={() => (window.location.href = "/admin")}
            className="text-[10px] text-white/10 hover:text-white/20 transition-colors mt-2 bg-transparent border-none cursor-pointer"
          >
            ·
          </button>
        )}
      </footer>
      <Analytics />
    </div>
  );
}
