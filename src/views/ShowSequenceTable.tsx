import { auth, logout } from "../firebase";
import NavBar from "../components/NavBar";
import figureNavbarBg from "../assets/figure_navbar.svg";
import arrowleftBg from "../assets/Back.svg";
import arrowrightBg from "../assets/Next.svg";
import acceptButtonBg from "../assets/acceptButton_enabled.svg";
import acceptButtonDisabledBg from "../assets/acceptButton_disabled.svg";
import generateButtonBg from "../assets/generate_patent.svg";
import loadingIcon from "../assets/logo/loading.gif"
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShowSequenceTable() {
  const user = auth.currentUser;
  const API_BASE = import.meta.env.VITE_API_BASE;

  const navigate = useNavigate();
  const processResultRaw = sessionStorage.getItem("processResult");
  const processResult = processResultRaw ? JSON.parse(processResultRaw) : null;

  const initialDescriptions = processResult
    ? Object.values(processResult.data).map(item =>
        item.description
      )
    : [];


  const [loading, setLoading] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const allAccepted = true;

    // join all descriptions into one string separated by newlines
    const [descriptions, _setDescription] = useState<string>(
      initialDescriptions.join("\n ")
    );

    // console.log("Descriptions:", descriptions);
    // console.log("Length:", descriptions.length);

    const setDescription = (updater: string | ((prev: string) => string)) => {
    _setDescription((prev) => {
        const newDesc = typeof updater === "function" ? updater(prev) : updater;

        // persist to sessionStorage
        if (processResult) {
        const keys = Object.keys(processResult.data);
        if (keys.length > 0) {
            processResult.data[keys[0]].description = newDesc;
        }
        sessionStorage.setItem("processResult", JSON.stringify(processResult));
        }

        return newDesc;
    });
    };

  const handleAccept = () => {
    // ✅ a) update description (already in state)
    setAccepted((prev) => {
      const newArr = [...prev];
      newArr[currentIndex] = true;
      return newArr;
    });

    // ✅ c) move to next unaccepted image if available
    const nextIndex = accepted.findIndex((a, idx) => !a && idx !== currentIndex);
    if (nextIndex !== -1) {
      setCurrentIndex(nextIndex);
    }
  };

const handleGenerate = async () => {

  setLoading(true);
  try {
    const uid = user?.uid;
    const email = user?.email;

    // 🔹 Grab processData from sessionStorage
    const processDataRaw = sessionStorage.getItem("processResult");
    const image_sentence_map = processDataRaw ? JSON.parse(processDataRaw) : {};

    const res = await fetch(`${API_BASE}/generateInput`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        uid,
        email,
        image_sentence_map,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      alert(`Error: ${err.error}`);
      setLoading(false);
      return;
    }

    const data = await res.json();
    console.log("✅ generateInput success:", data);

    // 🔹 Fire-and-forget: no await, no handling response
    // fetch(`${API_BASE}/generateInput`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     uid,
    //   }),
    // });

    setLoading(false);

    // (Optional) store results in sessionStorage if you need them later
    sessionStorage.setItem("generateInputResult", JSON.stringify(data));
    navigate("/Generating");

  } catch (err) {
    console.error("❌ generateInput failed:", err);
    setLoading(false);
  }
};
return (
    <div style={{ height: "100vh", position: "relative" , backgroundColor: "#f5f5f5"}}>

      
    {/* ✅ Overlay goes here */}
    {loading && (
<div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",   // 👈 anchor to top
    paddingTop: "40vh",         // 👈 push down 40% of screen height
    zIndex: 2000,
  }}
>
  <img
    src={loadingIcon}
    alt="Loading..."
    style={{
      maxWidth: "15vh",
      maxHeight: "15vh",
      width: "auto",
      height: "auto",
    }}
  />
</div>
    )}

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
    width: "60vh",
    height: "60vh",
    background: "white",
    marginTop: "10vh",
    boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "5%",  // 👈 adds the 10% padding
    boxSizing: "border-box", // 👈 ensures padding is included in 60vh box
  }}
>
  <img
    // src={images[currentIndex]}
    alt={`Image ${currentIndex + 1}`}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain", // 👈 keeps aspect ratio, fills until padding edges
    }}
  />
  {/* </div> */}
      
  {/* Smaller half-size div */}
   <div
      style={{
        width: "30vh",
        height: "25vh",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
        position: "absolute",
        top: "10vh",
        left: "calc(50% + 30vh + 40px)", 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",   // 👈 center horizontally
        justifyContent: "center", // 👈 center vertically
        padding: "16px",
        // textAlign: "center",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "16px",
          fontWeight: 500,
          marginBottom: "8px",
          padding: "4px 4px",
        }}
      >
        Accept or edit the description for this image.
      </div>

      {/* Scrollable editable textbox */}
      <textarea
          value={descriptions}
          disabled={allAccepted} // or some other global flag
          onChange={(e) => {
            const newDescs = [...descriptions];
            newDescs[currentIndex] = e.target.value;
            setDescriptions(newDescs);
          }}        
          style={{
          width: "90%",   // 👈 half width of small div
          height: "35%",  // 👈 half height of small div
          background: "#f5f5f5",
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "8px",
          resize: "none",
          fontFamily: "Inter, sans-serif",
          fontSize: "16px",
          color: "#333",
          marginBottom: "20px",
          overflowY: "auto",
        }}
      />

      {/* Accept button */}
      <div
        onClick={allAccepted ? handleAccept : undefined}
        style={{
          width: "100%",
          height: "50px",
          backgroundImage: `url(${allAccepted ? acceptButtonDisabledBg : acceptButtonBg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          cursor: allAccepted ? "not-allowed" : "pointer",
        }}
      />

        {/* Navigation buttons */}
    </div>
    </div>
    </div>    
    <div


      style={{
        display: "flex",
        justifyContent: "center",
        position: "relative",
        marginTop: "20px",
      }}
    >
      {/* Background div */}
    
    </div>

      {/* d) Generate button appears only after all accepted */}
      {allAccepted && (
        <div
          onClick={() => console.log("Generate invention disclosure")}
          style={{
            width: "30vh",
            height: "20vh",
            background: "white",
            borderRadius: "20px",
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
            position: "absolute",
            top: "40vh",
            left: "calc(50% + 30vh + 40px)", 
            display: "flex",
            flexDirection: "column",
            alignItems: "center",   // 👈 center horizontally
            justifyContent: "center", // 👈 center vertically
            padding: "16px",
            fontFamily: "Inter, sans-serif",
            fontSize: "16px",
            color: "#333",
            // textAlign: "center",
          }}
        >All figure descriptions have been accepted.
        <br></br><br></br>
        Ready to generate your patent application?
          
        <div
          onClick={handleGenerate}
          style={{
            width: "100%",
            height: "66px",
            backgroundImage: `url(${generateButtonBg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            cursor: "pointer",
            marginTop: "20px",
          }}/>
        </div>
      )}

  </div>

  
);
}
