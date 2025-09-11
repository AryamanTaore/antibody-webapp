import { useEffect, useState } from "react";
import { useRive } from "@rive-app/react-canvas";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

const ProcessUpload = () => {
  const navigate = useNavigate();
  const [animationLoaded, setAnimationLoaded] = useState(false);

  const { RiveComponent } = useRive({
    src: "/antibody-webapp/keyora_intro_splash.riv",
    artboard: "process",
    autoplay: true,
    onLoad: () => setAnimationLoaded(true),
  });

  useEffect(() => {
    if (animationLoaded) {
      const timer = setTimeout(() => {
        navigate("/login"); // 👈 go to next step in your flow
      }, 3000); // adjust to your actual animation length

      return () => clearTimeout(timer);
    }
  }, [animationLoaded, navigate]);

return (
    <div style={{ height: "100vh", position: "relative" }}>
    {/* Navbar overlays at the top, doesn’t consume flex space */}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
      <NavBar />
    </div>

    <div
        style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        background: "#fff",
        boxSizing: "border-box",
        overflow: "hidden",
        }}
    >
        <div
        style={{
            width: "100%",
            maxWidth: "500px", // optional max width
            height: "100%",
            padding: "0 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
        >
        <RiveComponent
            style={{
            width: "50%",
            height: "50%",
            display: "block",
            }}
        />
        </div>
    </div>
    </div>
    );

};

export default ProcessUpload;
