import React, { useState, useMemo } from "react";
import {
  Calendar, Users, CheckCircle2, User,
  AlertCircle, Sparkles, Search,
} from "lucide-react";
import { WORKSHOPS, INITIAL_PARTICIPANTS } from "../data/workshops.js";
import ConfirmationModal from "./ConfirmationModal.jsx";
import ParticipantCard from "./ParticipantCard.jsx";

function emptyForm() {
  return { name: "", email: "", phone: "", workshopId: WORKSHOPS[0].id };
}

export default function WorkshopRegistration() {
  const [participants, setParticipants] = useState(INITIAL_PARTICIPANTS);
  const [form, setForm] = useState(emptyForm());
  const [errors, setErrors] = useState({});
  const [confirmed, setConfirmed] = useState(null);
  const [search, setSearch] = useState("");
  const [workshopFilter, setWorkshopFilter] = useState("All");
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const seatsTaken = (workshopId) =>
    participants.filter((p) => p.workshopId === workshopId).length;

  const selectedWorkshop = WORKSHOPS.find((w) => w.id === form.workshopId);
  const fillPct = Math.min(100, (seatsTaken(selectedWorkshop.id) / selectedWorkshop.seats) * 100);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ""))) e.phone = "Enter a valid 10-digit number";

    const workshop = WORKSHOPS.find((w) => w.id === form.workshopId);
    const duplicate = participants.some(
      (p) => p.email.toLowerCase() === form.email.trim().toLowerCase() && p.workshopId === form.workshopId
    );
    if (duplicate) e.duplicate = `Already registered for "${workshop.name}"`;
    if (workshop && seatsTaken(form.workshopId) >= workshop.seats && !duplicate)
      e.full = `"${workshop.name}" is fully booked`;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const newEntry = { id: Date.now(), ...form, name: form.name.trim(), email: form.email.trim() };
    setParticipants((prev) => [newEntry, ...prev]);
    setConfirmed(newEntry);
    setForm(emptyForm());
    setErrors({});
  };

  const removeParticipant = (id) => {
    setParticipants((prev) => prev.filter((p) => p.id !== id));
    showToast("Registration removed");
  };

  const workshopOf = (id) => WORKSHOPS.find((w) => w.id === id);

  const formatDate = (d) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short", month: "short", day: "numeric",
    });

  const filtered = useMemo(() =>
    participants.filter((p) => {
      const q = search.toLowerCase();
      return (
        (p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q)) &&
        (workshopFilter === "All" || p.workshopId === workshopFilter)
      );
    }),
    [participants, search, workshopFilter]
  );

  return (
    <div className="wr-page">
      <div className="wr-container">

        {/* Header */}
        <div className="wr-header">
          <div className="wr-header-icon">
            <Sparkles size={26} color="#fff" />
          </div>
          <h1 className="wr-title">Workshop Registration</h1>
          <p className="wr-subtitle">Reserve your seat - confirmation is instant</p>
        </div>

        <div className="wr-grid">

          {/* Registration Form */}
          <div className="wr-form-col">
            <div className="wr-card wr-form-card">
              <h2 className="wr-form-heading">
                <User size={18} className="wr-icon-violet" /> Register
              </h2>

              <div className="wr-fields">
                <div className="wr-field">
                  <label className="wr-label">Full Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Priya Raman"
                    className={`wr-input ${errors.name ? "wr-input-error" : ""}`}
                  />
                  {errors.name && <p className="wr-error">{errors.name}</p>}
                </div>

                <div className="wr-field">
                  <label className="wr-label">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className={`wr-input ${errors.email ? "wr-input-error" : ""}`}
                  />
                  {errors.email && <p className="wr-error">{errors.email}</p>}
                </div>

                <div className="wr-field">
                  <label className="wr-label">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className={`wr-input ${errors.phone ? "wr-input-error" : ""}`}
                  />
                  {errors.phone && <p className="wr-error">{errors.phone}</p>}
                </div>

                <div className="wr-field">
                  <label className="wr-label">Workshop</label>
                  <select
                    value={form.workshopId}
                    onChange={(e) => setForm({ ...form, workshopId: e.target.value })}
                    className="wr-select"
                  >
                    {WORKSHOPS.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} - {formatDate(w.date)}
                      </option>
                    ))}
                  </select>
                  <div className="wr-seat-info">
                    <span className="wr-seat-date">
                      <Calendar size={12} /> {formatDate(selectedWorkshop.date)}
                    </span>
                    <span>{seatsTaken(selectedWorkshop.id)}/{selectedWorkshop.seats} filled</span>
                  </div>
                  <div className="wr-bar-bg">
                    <div className="wr-bar-fill" style={{ width: `${fillPct}%` }} />
                  </div>
                </div>

                {(errors.duplicate || errors.full) && (
                  <div className="wr-alert">
                    <AlertCircle size={16} className="wr-alert-icon" />
                    <p>{errors.duplicate || errors.full}</p>
                  </div>
                )}

                <button className="wr-submit-btn" onClick={handleSubmit}>
                  <CheckCircle2 size={18} />
                  Confirm Registration
                </button>
              </div>
            </div>
          </div>

          {/* Participant List */}
          <div className="wr-list-col">
            <div className="wr-card">
              <h2 className="wr-form-heading">
                <Users size={18} className="wr-icon-violet" />
                Registered Participants
                <span className="wr-count-badge">{participants.length}</span>
              </h2>

              <div className="wr-filters">
                <div className="wr-search-wrap">
                  <Search size={15} className="wr-search-icon" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    className="wr-search-input"
                  />
                </div>
                <select
                  value={workshopFilter}
                  onChange={(e) => setWorkshopFilter(e.target.value)}
                  className="wr-select wr-filter-select"
                >
                  <option value="All">All Workshops</option>
                  {WORKSHOPS.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>

              <div className="wr-list">
                {filtered.length === 0 ? (
                  <div className="wr-empty">
                    <Users size={28} />
                    <p>No participants found</p>
                  </div>
                ) : (
                  filtered.map((p) => (
                    <ParticipantCard
                      key={p.id}
                      participant={p}
                      workshop={workshopOf(p.workshopId)}
                      onRemove={() => removeParticipant(p.id)}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {confirmed && (
        <ConfirmationModal
          participant={confirmed}
          workshop={workshopOf(confirmed.workshopId)}
          formatDate={formatDate}
          onClose={() => setConfirmed(null)}
        />
      )}

      {toast && <div className="wr-toast">{toast}</div>}
    </div>
  );
}
