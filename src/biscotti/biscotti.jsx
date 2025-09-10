import React, { useState, useEffect } from "react";

export default function Banner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("site_consent");
    if (!consent) setShow(true);
  }, []);

  if (!show) return null;

  const handleAccept = () => {
    localStorage.setItem("site_consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("site_consent", "declined");
    setShow(false);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "10px",
      left: "65%",
      width: "500px",
      minHeight: "150px",
      padding: "20px",
      borderRadius: "8px",
      background: "var(--primary)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      zIndex: 9999,
    }}>
      <p style={{color: white}}>
        Questo sito utilizza cookie per migliorare l'esperienza utente.{" "}
        <a href="/policy" style={{ color: "#a3d0ff" }}>Leggi di più</a>
      </p>
      <div>
        <button onClick={handleAccept} style={{
          color: "#ffffff",
          background: "var(--success-color)",
          padding: "10px 20px",
          borderRadius: "4px",
          border: "none",
          fontWeight: "bold",
          marginRight: "10px"
        }}>Accetta</button>
        <button onClick={handleDecline} style={{
          color: "#ffffff",
          background: "var(--error-color)",
          padding: "10px 20px",
          borderRadius: "4px",
          border: "none",
          fontWeight: "bold",
        }}>Rifiuta</button>
      </div>
    </div>
  );
}
