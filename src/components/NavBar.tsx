import React from "react";
import { useLocation } from "react-router-dom";
import keyoraLogoStandard from "../assets/logo/keyora_logo_standard.svg";
import keyoraLogoWhite from "../assets/logo/keyora_logo_white.svg";

const NavBar: React.FC = () => {
  const location = useLocation();
  const isWhiteLogo = ["/login", "/upload"].includes(location.pathname.toLowerCase());
  const logoSrc = isWhiteLogo ? keyoraLogoWhite : keyoraLogoStandard;

  return (
    <nav
      style={{
        position: "absolute",     // or "fixed" if you want it always visible on scroll
        top: "10px",
        left: 0,
        width: "100%",
        background: "transparent",
        boxShadow: "none",
        height: "64px",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        zIndex: 1000              // makes sure it overlays on top of page content
      }}
    >
      <img
        src={logoSrc}
        alt="Keyora Logo"
        style={{ height: "40px", width: "auto" }}
      />
    </nav>
  );
};

export default NavBar;
