import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Splash from "./views/Splash";
import Login from "./views/Login";
import Upload from "./views/Upload";
import ImageCheck from "./views/ImageCheck";
import Generating from "./views/Generating";
import { useEffect, useState } from "react";
import { watchAuth } from "./firebase";
import type { User } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState<User|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return watchAuth(u => { setUser(u); setLoading(false); });
  }, []);

  if (loading) return <div>Loading…</div>;

  return (
    <BrowserRouter>
      <Routes>
        {/* public */}
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />

        {/* protected */}
        <Route path="/Upload" element={user ? <Upload /> : <Navigate to="/login" />} />
        <Route path="/ImageCheck" element={user ? <ImageCheck /> : <Navigate to="/login" />} />
        <Route path="/Generating" element={user ? <Generating /> : <Navigate to="/login" />} />

        {/* <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" />} /> */}

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
