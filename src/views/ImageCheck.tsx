import { auth, logout } from "../firebase";
import NavBar from "../components/NavBar";
import figureNavbarBg from "../assets/figure_navbar.svg";
import arrowleftBg from "../assets/Back.svg";
import arrowrightBg from "../assets/Next.svg";
import acceptButtonBg from "../assets/acceptButton_enabled.svg";
import acceptButtonDisabledBg from "../assets/acceptButton_disabled.svg";
import generateButtonBg from "../assets/generate_patent.svg";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ImageCheck() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const images = [
    "https://www.bicycleretailer.com/sites/default/files/styles/colorbox_popup/public/images/article/p18_yamaha_patent-2.jpg?itok=xWF2chMp",
    "https://www.mewburn.com/hs-fs/hubfs/Figure%202%20-%20The%20figures%20for%20a%20patent%20relating%20to%20a%20penny%20farthing%20in%201885.png?width=505",
    "https://www.bicycleretailer.com/sites/default/files/styles/colorbox_popup/public/images/article/p22_patent_imageflip.jpg?itok=TC5EVRCO"
  ];

  const [descriptions, setDescriptions] = useState([
    "description 1",
    "description 2",
    "description 3",
  ]);

  const [accepted, setAccepted] = useState<boolean[]>(
    Array(images.length).fill(false)
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const allAccepted = accepted.every((a) => a);

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
      width: "60vh",
      height: "60vh",
      background: "white",
      marginTop: "10vh", // 25vh from the top
      boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <img
      src={images[currentIndex]}
      alt={`Image ${currentIndex + 1}`}
      style={{
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain", // maintain aspect ratio inside square
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
          value={descriptions[currentIndex]}
          disabled={accepted[currentIndex]} // ✅ b) disable if accepted
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
        onClick={!accepted[currentIndex] ? handleAccept : undefined}
        style={{
          width: "100%",
          height: "50px",
          backgroundImage: `url(${accepted[currentIndex] ? acceptButtonDisabledBg : acceptButtonBg})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
          cursor: accepted[currentIndex] ? "not-allowed" : "pointer",
        }}
      />
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
      <div
        style={{
          width: "300px",        // adjust width
          height: "60px",        // adjust height
          backgroundImage: `url(${figureNavbarBg})`,
          backgroundRepeat: "no-repeat",
          // backgroundSize: "100% 100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Left button */}
        <img
          src={arrowleftBg}
          alt="Previous"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          style={{
            position: "absolute",
            left: "18px",
            top: "15px",
            width: "24px",
            height: "24px",
            opacity: currentIndex === 0 ? 0.3 : 1, // dim if disabled
            cursor: currentIndex === 0 ? "not-allowed" : "pointer",
          }}
        />

        {/* Center text */}
        <span
          style={{
            fontFamily: '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
            fontWeight: 500,
            fontSize: "18px",
            color: "#333",
            marginTop: "-4px",   // 👈 nudge upwards
            marginLeft: "-4px"
          }}
        >
          Image {currentIndex + 1} of {images.length}
        </span>

        {/* Right button */}
        <img
          src={arrowrightBg}
          alt="Next"
          onClick={() =>
            setCurrentIndex((i) => Math.min(images.length - 1, i + 1))
          }
          style={{
            position: "absolute",
            right: "27px",
            top: "15px",
            width: "24px",
            height: "24px",
            opacity: currentIndex === images.length - 1 ? 0.3 : 1,
            cursor:
              currentIndex === images.length - 1 ? "not-allowed" : "pointer",
          }}
        />
      </div>
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
          onClick={() => navigate("/Generating")}
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
