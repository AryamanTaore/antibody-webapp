import { Link } from "react-router-dom";

export default function Splash() {
  return (
    <div style={{display:"grid",placeItems:"center",height:"100vh"}}>
      <h1>Welcome to My App 🚀</h1>
      <p>This is the landing page.</p>
      <Link to="/login">
        <button style={{marginTop:"1rem"}}>Get Started</button>
      </Link>
    </div>
  );
}
