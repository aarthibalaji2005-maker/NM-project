import React from "react";
import { CheckCircle2, Calendar, Mail, X } from "lucide-react";

export default function ConfirmationModal({ participant, workshop, formatDate, onClose }) {
  return (
    <div className="wr-overlay" onClick={onClose}>
      <div className="wr-modal" onClick={(e) => e.stopPropagation()}>
        <button className="wr-modal-close" onClick={onClose}>
          <X size={18} />
        </button>
        <div className="wr-modal-icon">
          <CheckCircle2 size={32} color="#fff" />
        </div>
        <h3 className="wr-modal-title">You're Registered!</h3>
        <p className="wr-modal-sub">A confirmation has been sent for the workshop below.</p>
        <div className="wr-modal-info">
          <p className="wr-modal-ws-name">{workshop.name}</p>
          <p className="wr-modal-meta"><Calendar size={12} /> {formatDate(workshop.date)}</p>
          <p className="wr-modal-meta"><Mail size={12} /> Confirmation sent to {participant.email}</p>
        </div>
        <button className="wr-modal-btn" onClick={onClose}>Done</button>
      </div>
    </div>
  );
}