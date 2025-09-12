import React, { useState, useEffect } from "react";
import "../style/cookie.css"

export default function Banner() {
  const [show, setShow] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("site_consent");
    if (!consent) {
      setShow(true);
      setTimeout(() => setIsVisible(true), 10);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => setShow(false), 300);
  };

  const handleAccept = () => {
    localStorage.setItem("site_consent", "accepted");
    handleClose();
  };

  const handleDecline = () => {
    localStorage.setItem("site_consent", "declined");
    handleClose();
  };

  const resetConsent = () => {
    localStorage.removeItem("site_consent");
    setShow(true);
    setTimeout(() => setIsVisible(true), 10);
  };
  return (
    <>
      <div className={`cookie-banner ${isVisible ? 'visible' : ''}`}>
        <div className="banner-content">
          <h3>Utilizzo dei Cookie</h3>
          <p>
            Utilizziamo cookie per migliorare la tua esperienza di navigazione, 
            analizzare il traffico e personalizzare i contenuti.{" "}
            <a href="/policy">Maggiori informazioni</a>
          </p>
          <div className="banner-actions">
            <button className="btn-accept" onClick={handleAccept}>
              Accetta tutti
            </button>
            <button className="btn-decline" onClick={handleDecline}>
              Rifiuta
            </button>
          </div>
        </div>
      </div>
    </>
  );
}