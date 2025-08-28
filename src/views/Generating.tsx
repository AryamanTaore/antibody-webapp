import { auth, logout } from "../firebase";
import NavBar from "../components/NavBar";
import figureNavbarBg from "../assets/figure_navbar.svg";
import arrowleftBg from "../assets/Back.svg";
import arrowrightBg from "../assets/Next.svg";
import acceptButtonBg from "../assets/acceptButton_enabled.svg";
import acceptButtonDisabledBg from "../assets/acceptButton_disabled.svg";
import generateButtonBg from "../assets/generate_patent_again.svg";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Generating() {
  const user = auth.currentUser;
  const navigate = useNavigate();
return (
    <div style={{ height: "100vh", position: "relative" , backgroundColor: "#f5f5f5"}}>
    {/* Navbar overlays at the top, doesn’t consume flex space */}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
      <NavBar />
    </div>

{/* Outer container */}
<div
  style={{
    display: "flex",
    justifyContent: "center", // centers the BIG square
    position: "relative",     // so we can absolutely position the small one
  }}
>
{/* Main square div */}
<div
  style={{
    width: "50vh",
    height: "30vh",
    background: "white",
    fontFamily: "Inter, sans-serif",
    fontSize: "18px",
    fontWeight: 500,
    marginTop: "30vh",
    boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",   // stack text + button
    justifyContent: "center",
    alignItems: "center",
    padding: "0 30px",         // fixed padding syntax
    borderRadius: "8px",
  }}
>
  <div>
    Your patent application is being prepared and will be emailed to you within the hour.
    <br />
    <br />
    Would you like to start another one now?
  </div>

  <div
    onClick={() => navigate("/Upload")}
    style={{
      width: "100%",
      height: "55px",

      backgroundImage: `url(${generateButtonBg})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "100% 100%",
      backgroundPosition: "center",
      cursor: "pointer",
      marginTop: "40px",
    }}
  />
</div>
</div>
</div>
);
}
