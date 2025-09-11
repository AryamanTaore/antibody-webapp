import { auth, logout } from "../firebase";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import generateseqdisable from "../assets/generate_seq_disable.svg"
import generateseqenable from "../assets/generate_seq_enable.svg"
import addChain from "../assets/add_chain.svg"
import removeChain from "../assets/remove_chain.svg"
import { useRef, useState } from "react";
import LoadingIcon from "../components/LoadingIcon"; // adjust path as needed

export default function AASequence() {
  const user = auth.currentUser;
  const API_BASE = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  // const [chains, setChains] = useState([
  // { type: "None", description: "", sequence: "" },
  const [chains, setChains] = useState([
  {
    heavyDescription: "",
    heavySequence: "",
    lightDescription: "",
    lightSequence: "",
  },
]);


const handleAddChain = () => {
  if (chains.length >= 10) return;
  setChains([
    ...chains,
    { heavyDescription: "", heavySequence: "", lightDescription: "", lightSequence: "" },
  ]);
};
 
const handleRemoveChain = (indexToRemove: number) => {
  const updatedChains = chains.filter((_, index) => index !== indexToRemove);
  setChains(updatedChains);
};
// ---------Uncomment this when backend is set up-----------
// const handleGenerate = async () => {
//     
    // const allChainsFilled = chains.every(
    //     chain => chain.heavySequence.trim() !== "" && chain.lightSequence.trim() !== ""
    //   );

    //   if (!allChainsFilled) {
    //     alert("Please fill both heavy and light sequences for all chains before proceeding.");
    //     return;
    //   }

//   setLoading(true);
//   try {
//     const uid = user?.uid || "anonymous";
//     const payload = {
//       uid,
//       chains,
//     };

//     const res = await fetch(`${API_BASE}/process_sequences`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       alert(`Error: ${err.error}`);
//       setLoading(false);
//       return;
//     }

//     const data = await res.json();
//     sessionStorage.setItem("processResult", JSON.stringify(data));
//     console.log("handleGenerate: navigating to /ProcessUpload (debug)");
//     navigate("/ProcessUpload");

//   } catch (err) {
//     console.error("Processing failed", err);
//     alert("Processing failed, please try again.");
//   } finally {
//     setLoading(false);
//   }
// };
//-------remove this, only for debug until backend is setup---------
const handleGenerate = async () => {
  
  const allChainsFilled = chains.every(
      chain => chain.heavySequence.trim() !== "" && chain.lightSequence.trim() !== ""
    );

  if (!allChainsFilled) return; // ❌ Prevent navigation


  setLoading(true); // show loader
  try {
      const uid = user?.uid; // 👈 from Firebase Auth
      // Stringify and encode the chains array
      const raw_seq_list = encodeURIComponent(JSON.stringify(chains));

      const res = await fetch(
        `${API_BASE}/getSequence?uid=${uid}&raw_seq_list=${raw_seq_list}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(`Error: ${err.error}`);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Process result:", data);

      // Store result in sessionStorage
      sessionStorage.setItem("processResult", JSON.stringify(data));

      if (data["success"] === true) {
        navigate("/SeqGenerator");
      }
     
  } catch (err) {
    console.error("Process failed", err);
    alert("Processing failed, please try again.");
  } finally {
    console.log('complete')
    setLoading(false);
  }
};

return (
  <div style={{ height: "100%", position: "relative", overflow:"hidden", }}>

  {loading && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "white", // or semi-transparent like 'rgba(255,255,255,0.8)'
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999, // Must be higher than anything else on the page
          pointerEvents: "auto", // Block user interaction
        }}
      >
        <LoadingIcon/>
      </div>
    )}

    {/* Navbar overlays at the top, doesn’t consume flex space */}
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
      <NavBar />
    </div>

    
    {/* Split screen container */}
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Left blue panel */}
      <div
        style={{
          flex: 1,
          background: "#007bff",
          color: "white",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          paddingTop: "15vh", // adjust if you want it lower/higher
          boxSizing: "border-box",
        }}
      >
        <h1 className="heading-xl" style={{ marginBottom: "2rem" }}>
          ENTER AMINO ACID SEQUENCES
        </h1>

        <div
          className="paragraph-xl"
          style={{
            marginRight: "2rem",
            lineHeight: "1.6",
            maxWidth: "600px", // optional: keep text readable
          }}
        >
          <p>
            Enter sequences for paired chains in one of the following formats:
          </p>
          <ul style={{ paddingLeft: "1rem", marginTop: "1rem" }}>
            <li>HDDVRS</li>
            <li>Hjh-Asp-Asp-Val-Arg-Ser</li>
            <li>Hpy Gly Tyr Asp Tyr</li>
          </ul>
        </div>
      </div>

      {/* Right chain sequence panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          // critical for flex scrolling correctness
          minWidth: 0,
          minHeight: 0,
          height: "100%",
          // show scroll only when needed, and only after first chain
          overflowY: "auto",
          overflowX: "auto",
          padding: "2rem",
          paddingTop: "50px",
          paddingRight: "50px",
          backgroundColor: "white",
          boxSizing: "border-box",
        }}
      >
        <div style={{ maxWidth: "1200px", width: "100%", margin:"0 auto"}}>
        {chains.map((chain, index) => (
          <div key={index} style={{ marginBottom: "2rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "black",
              }}
            >
              <h2>Paired chain {index + 1}</h2>
              {index > 0 && (
                <button
                  className = "button-hover"
                  onClick={() => handleRemoveChain(index)}
                  style={{
                    backgroundImage: `url(${removeChain})`,
                    color: "black",
                    border: "none",
                    borderRadius: "4px",
                    padding: 0,
                    cursor: "pointer",
                    width: "171px",
                    height: "48px",
                    fontFamily: "Inter",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    overflow: "hidden",
                    filter: "none",
                    outline: "none",      // ✅ Remove focus outline
                    backgroundColor: "transparent"
                  }}
                >
                </button>
              )}
            </div>

            {/* Heavy chain input */}
            <label>Heavy chain description</label>
            <input
              type="text"
              value={chain.heavyDescription}
              onChange={(e) => {
                const updated = [...chains];
                updated[index].heavyDescription = e.target.value;
                setChains(updated);
              }}
              placeholder="Heavy chain description (optional)"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "16px",
                backgroundColor: "#F0F1F1",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontFamily:"Inter",
                fontSize: "16px",
                color: "#7D7F86",
                outline: "none",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
              }}
            />

            <textarea
              value={chain.heavySequence}
              onChange={(e) => {
                const updated = [...chains];
                updated[index].heavySequence = e.target.value;
                setChains(updated);
              }}
              placeholder="Enter a sequence in SGYD or Ser-Gly-Tyr-Asp or Ser Gly Tyr Asp format"
              style={{
                width: "100%",
                height: "120px",
                padding: "10px",
                marginBottom: "16px",
                backgroundColor: "#F0F1F1",
                border: "1px solid #ccc",
                borderRadius: "8px",
                font: "Inter",
                fontSize: "16px",
                color: "#7D7F86",
                outline: "none",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
              }}
            />

            {/* Light chain input */}
            <label>Light chain description</label>
            <input
              type="text"
              value={chain.lightDescription}
              onChange={(e) => {
                const updated = [...chains];
                updated[index].lightDescription = e.target.value;
                setChains(updated);
              }}
              placeholder="Light chain description (optional)"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "16px",
                backgroundColor: "#F0F1F1",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontFamily: "Inter",
                fontSize: "16px",
                color: "#7D7F86",
                outline: "none",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
              }}
            />

            <textarea
              value={chain.lightSequence}
              onChange={(e) => {
                const updated = [...chains];
                updated[index].lightSequence = e.target.value;
                setChains(updated);
              }}
              placeholder="Enter a sequence in SGYD or Ser-Gly-Tyr-Asp or Ser Gly Tyr Asp format"
              style={{
                width: "100%",
                height: "120px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#F0F1F1",
                border: "1px solid #ccc",
                borderRadius: "8px",
                font: "Inter",
                fontSize: "16px",
                color: "#7D7F86",
                outline: "none",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)",
              }}
            />
          </div>
        ))}
        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", marginTop: "1rem",}}>
        <button
            type="button"
            className = "button-hover"
            onClick={handleAddChain}
            style={{
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
                padding: 0,
                overflow: "hidden",
                filter: "none",
                border: "none",       // ✅ Remove border
                outline: "none",      // ✅ Remove focus outline
                backgroundColor: "transparent",
            }}
          >
            <img src={addChain} alt="Add a chain" style={{ width: "200px", height: "50px", pointerEvents: "none" }} />
          </button>
        <button
            className = "button-hover"
            onClick={handleGenerate}
            style={{
            width: "280px",
            height: "50px",
            backgroundImage: `url(${
                      chains.every(chain => chain.heavySequence.trim() !== "" && chain.lightSequence.trim() !== "")
                    ? generateseqenable
                    : generateseqdisable
                })`,
            backgroundRepeat: "no-repeat",
            borderRadius: "12px",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
            cursor: chains.every(chain => chain.heavySequence.trim() !== "" && chain.lightSequence.trim() !== "")
                  ? "pointer"
                  : "not-allowed",
            padding: 0, 
            filter: "none",
            border: "none",       // ✅ Remove border
            outline: "none",      // ✅ Remove focus outline
            backgroundColor: "transparent",
            pointerEvents: chains.every(chain => chain.heavySequence.trim() !== "" && chain.lightSequence.trim() !== "")
                  ? "auto"
                  : "none",
            }}
        >
            <span style={{ visibility: "hidden" }}>Create sequence table</span>
        </button>
        </div>
      </div>
    </div>
  </div>
  </div>
);

}
