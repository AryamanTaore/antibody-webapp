import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import Splash from "./views/Splash";
import Login from "./views/Login";
import Upload from "./views/Upload";
import ImageCheck from "./views/ImageCheck";
import IntroSplash from "./views/Intro_splash";
import ProcessUpload from "./views/Process_Upload";
import Generating from "./views/Generating";
import AASequence from "./views/AASequence";
import SeqGenerator from "./views/SeqGenerator";
import { useEffect, useState } from "react";
import { watchAuth } from "./firebase";
import type { User } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const remembered = localStorage.getItem("rememberMe") === "true";
    const savedEmail = localStorage.getItem("userEmail");
    if (remembered && savedEmail) {
      // Optionally, you could pre-fill user info or auto-login here
      setEmail(savedEmail);
      setRememberMe(true);
      console.log("User chose to be remembered.");
    }

    return watchAuth((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading…</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/" element={<IntroSplash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ProcessUpload" element={<ProcessUpload />} />

        {/* protected */}
        <Route path="/Upload" element={user ? <Upload /> : <Navigate to="/login" />} />
        <Route path="/ImageCheck" element={user ? <ImageCheck /> : <Navigate to="/login" />} />
        <Route path="/Generating" element={user ? <Generating /> : <Navigate to="/login" />} />
        <Route path="/AASequence" element={user ? <AASequence /> : <Navigate to="/login" />} />
        <Route path="/SeqGenerator" element={user ? <SeqGenerator /> : <Navigate to="/login" />} />

        {/* <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} /> */}

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
