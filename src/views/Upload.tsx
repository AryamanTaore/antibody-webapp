import { auth, logout } from "../firebase";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import uploadBg from "../assets/upload.svg";
import fileUploadingBg from "../assets/fileProgress_uploading.svg";
import fileCompletedBg from "../assets/fileProgress_complete.svg";
import generateDisabled from "../assets/generate_disabled.svg";
import generateEnabled from "../assets/generate_enabled.svg";
import checkIcon from "../assets/check.png";

import { useRef, useState } from "react";

export default function Upload() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"uploading" | "done" | null>(null);
  const handleClick = () => {
    fileInputRef.current?.click();
  };


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (f: File) => {
    if (!f.name.endsWith(".docx")) {
      alert("Only .docx files are allowed.");
      return;
    }
    setFile(f);
    setStatus("uploading");

    // fake upload simulation
    setTimeout(() => setStatus("done"), 1500);
  };

  return (
    <div style={{ height: "100vh", position: "relative"}}>
      {/* Navbar overlays at the top, doesn’t consume flex space */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10 }}>
        <NavBar />
      </div>

      {/* Split screen container */}
      <div style={{ display: "flex", height: "100%" }}>
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
          paddingTop: "15vh",
        }}
      >
        <h1 className="heading-xl">UPLOAD INVENTION DOCUMENT</h1>
        <div
          className="paragraph-xl"
          style={{ marginRight: "0.5rem", lineHeight: "1.5" }}
        >
          <p>
            Upload a Microsoft Word document. Your document can contain text, figures, and amino acid sequences.
          </p>
        </div>
      </div>

  {/* Right upload panel */}
     <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingTop: "15vh",
          }}
        >
          <div style={{ width: "400px" , display:"flex", alignItems: "center", flexDirection: "column" }}>
            {/* Upload box */}
            <div
              onClick={handleClick}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              style={{
                width: "100%",
                height: "400px",
                backgroundImage: `url(${uploadBg})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "center",
                cursor: "pointer",
                border: isDragging
                  ? "3px dashed #007bff"
                  : "3px dashed transparent",
                transition: "border 0.2s ease-in-out",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx"
                style={{ display: "none" }}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFile(e.target.files[0]);
                  }
                }}
              />
            </div>

            {/* File row */}
{file && (
  <div
    style={{
      marginTop: "20px",
      width: "100%",
      height: "80px",
      display: "flex",
      alignItems: "center",
      padding: "0 0px",
      backgroundImage: `url(${
        status === "done" ? fileCompletedBg : fileUploadingBg
      })`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "100% 100%",
      fontFamily: "Inter, sans-serif",
      fontSize: "14px",
      color: "#333",
      position: "relative",   // 👈 so the trash icon can be positioned
    }}
  >
    <span
      style={{
        marginLeft: "65px",
        marginTop: "0px",
        fontSize: "15px",
      }}
    >
      {file.name.replace(/\.docx$/i, "")}

      {status === "uploading" && (
        <div
          style={{
            marginTop: "5px",
            fontSize: "12px",
            color: "#999",
          }}
        >
          <span style={{ display: "flex", gap: "7px", alignItems: "center" }}>
            {`${Math.round(file.size / 1024)} KB`}
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
            Uploading...
          </span>
        </div>
      )}

      {status === "done" && (
        <div
          style={{
            marginTop: "5px",
            fontSize: "12px",
            color: "#999",
            display: "flex",
            gap: "6px",
            alignItems: "center",
          }}
        >
          {`${Math.round(file.size / 1024)} KB`}
          <img
            src={checkIcon}
            alt="check"
            style={{ width: "14px", height: "14px" }}
          />
          Complete
        </div>
      )}
    </span>

    {/* Trash Icon (absolute right) */}
    <div
      // src={trashIcon}
      // alt="Remove file"
      onClick={() => {
        setFile(null);     // 👈 clear selected file state
        setStatus(null);   // 👈 reset status if you track it
      }}
      style={{
        position: "absolute",
        right: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        width: "40px",
        height: "40px",
        cursor: "pointer",
        background: "transparent", // invisible but clickable
        border: "none",
        outline: "none",
      }}
    />
  </div>

  
)}
          
        {/* Generate button */}
        <div
          onClick={() => {
            if (file) {
              navigate("/ImageCheck");   // 👈 only navigate if a file is loaded
            }
          }}
          style={{
            width: "300px",
            height: "80px",
            marginTop: "30px",
            backgroundImage: `url(${
              file && status === "done" ? generateEnabled : generateDisabled
            })`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            alignItems: "center",
            cursor: file ? "pointer" : "not-allowed",
          }}
        />

          </div>
        
        </div>
      </div>
    </div>
  );
}