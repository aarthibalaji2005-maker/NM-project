import React from "react";
import { Mail, Phone, Trash2 } from "lucide-react";

export default function ParticipantCard({ participant: p, workshop: w, onRemove }) {
  const initials = p.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="wr-participant-card">
      <div className="wr-avatar">{initials}</div>
      <div className="wr-participant-info">
        <p className="wr-participant-name">{p.name}</p>
        <div className="wr-participant-meta">
          <span><Mail size={11} /> {p.email}</span>
          <span><Phone size={11} /> {p.phone}</span>
        </div>
      </div>
      <div className="wr-participant-right">
        <span className="wr-workshop-badge">{w.name}</span>
        <button className="wr-remove-btn" onClick={onRemove} aria-label="Remove">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}