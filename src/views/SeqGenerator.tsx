import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import LoadingIcon from "../components/LoadingIcon"; // adjust path as needed
import { auth, logout } from "../firebase";
import generateapplication from "../assets/generate_patent.svg";
import download from "../assets/download.svg";
import tryagain from "../assets/tryagain.svg";
import { useNavigate } from "react-router-dom";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun, WidthType, AlignmentType, BorderStyle, WrapNone} from "docx";
// import { saveAs } from "file-saver";

interface SequenceEntry {
  description: string;
  seq_id: number;
  sequence: string;
}
export default function SequenceTablePage() {
  const user = auth.currentUser;
  const API_BASE = import.meta.env.VITE_API_BASE;

  const navigate = useNavigate();
  const [data, setData] = useState<SequenceEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const HEADER_HEIGHT = 96; // px

  console.log('loading state:', loading);

const handleGenerate = async () => {
  setLoading(true);
  console.log("🟢 handleGenerate called");

  try {
    const uid = user?.uid;

    // 🔹 Await the fetch to wait for the request to complete
    const res = await fetch(`${API_BASE}/generateInput`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    });

    // Optional: parse the response if needed
    const result = await res.json();

    // Optionally store it in sessionStorage
    // sessionStorage.setItem("generateInputResult", JSON.stringify(data));

    // Now loading ends
    setLoading(false);

    // Then navigate
    if (result["success"] === false) {
      alert(`❌ Generation failed. Please try again. ${result.error}`);
      setLoading(false);
      return;
    }

    navigate("/Generating");
  } catch (err) {
    console.error("❌ generateInput failed:", err);
    setLoading(false);
  }
};


  // layout constants
  const FRAME_WIDTH = 2200;
  const GAP_PX = 60;
  const TABLE_WIDTH = 1350;
  const RIGHT_WIDTH = 350;
  const RIGHT_WIDTH_TABLE = 50;


const formatDomainName = (domain: string): string => {
  return domain
    // Insert hyphen before any CDR
    .replace(/(.*?)(CDR)/, (_, prefix, cdr) => `${prefix.trim()}-${cdr}`)
    // Replace "| kabat" etc. with proper formatting
    .replace(/\|\s*kabat/gi, "(Kabat)")
    .replace(/\|\s*chothia/gi, "(Chothia)")
    .replace(/\|\s*imgt/gi, "(IMGT)");
};



  const fetchData = () => {
    setError(null);

    try {
      const storedData = sessionStorage.getItem("processResult");

      if (!storedData) {
        throw new Error("No data found in sessionStorage under key 'processResult'");
      }

      const json = JSON.parse(storedData)['data'];
      setData(json);
      console.log("✅ Data loaded from sessionStorage:", json);
    } catch (err) {
      console.error("❌ Storage parse error:", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleDownload = () => {
    const tableRows = data.map((entry) =>
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: entry.description, alignment: AlignmentType.LEFT })],
            width: { size: 100, type: WidthType.DXA },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            },
          }),
          new TableCell({
            children: [new Paragraph({ text: String(entry.seq_id), alignment: AlignmentType.CENTER })],
            width: { size: 60, type: WidthType.DXA },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            },
          }),
          new TableCell({
            children: [new Paragraph({ text: entry.sequence, alignment: AlignmentType.LEFT })],
            width: { size: 50, type: WidthType.PERCENTAGE },
            margins: { top: 100, bottom: 100, left: 100, right: 100 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
            },
          }),
        ],
      })
    );

    const doc = new Document({
      sections: [
        {
          children: [
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: "Description", alignment: AlignmentType.CENTER })],
                      width: { size: 100, type: WidthType.DXA },
                      margins: { top: 100, bottom: 100, left: 100, right: 100 },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                      },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Seq ID", alignment: AlignmentType.CENTER })],
                      width: { size: 60, type: WidthType.DXA },
                      margins: { top: 100, bottom: 100, left: 100, right: 100 },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                      },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: "Sequence", alignment: AlignmentType.CENTER })],
                      width: { size: 50, type: WidthType.PERCENTAGE },
                      margins: { top: 100, bottom: 100, left: 100, right: 100 },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
                      },
                    }),
                  ],
                }),
                ...tableRows,
              ],
            }),
          ],
        },
      ],
    });

  

    // Packer.toBlob(doc).then((blob) => {
    //   saveAs(blob, "sequence_table.docx");
    // });
  };

  // // optional debug listener you had earlier — keep if you still need it
  // useEffect(() => {
  //   const onDocClick = (e: MouseEvent) => {
  //     console.log("DOC CLICK target:", (e.target as HTMLElement)?.outerHTML?.slice?.(0, 200));
  //   };
  //   document.addEventListener("click", onDocClick, true);
  //   return () => document.removeEventListener("click", onDocClick, true);
  // }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        paddingTop: HEADER_HEIGHT,
        width: "100%",
      }}
    >
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

      {/* Header */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_HEIGHT,
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          zIndex: 800,
          pointerEvents: "auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", pointerEvents: "none" }}>
          <NavBar />
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", pointerEvents: "auto" }}>
          <button
            type="button"
            className = "button-hover"
            onClick={() => {
              console.log("Try Again clicked ✅ (header button)");
              navigate("/Upload");
            }}
            style={{
              width: "132px",
              height: "48px",
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
            }}
          >
            <img src={tryagain} alt="Try again" style={{ width: "100%", height: "100%", display: "block", pointerEvents: "none" }} />
          </button>

          <button
            type="button"
            className = "button-hover"
            onClick={() => {
              console.log("Download clicked ✅ (header button)");
              handleDownload();
            }}
            style={{
              width: "140px",
              height: "48px",
              padding: 0,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "auto",
            }}
          >
            <img src={download} alt="Download" style={{ width: "100%", height: "100%", display: "block", pointerEvents: "none" }} />
          </button>
        </div>
      </div>

      {/* Loading overlay (visual only) */}
      
      
      {/* Main content frame (centers content on page and is responsive) */}
      <div
        style={{
          width: "100vw",
          padding: 0,
          marginTop: `${HEADER_HEIGHT}px`,
          boxSizing: "border-box",
          position: "relative", // Needed for fixed positioning context
        }}
      >
        {/* Main content container */}
        <div
          style={{
            maxWidth: `${FRAME_WIDTH}px`,
            margin: "0 auto",
            display: "flex",
            gap: `${GAP_PX}px`,
            alignItems: "flex-start",
            flexDirection: "row",
            justifyContent: "flex-start",
            boxSizing: "border-box",
            flexWrap: "nowrap",
            paddingRight: `${RIGHT_WIDTH + 24}px`
          }}
        >
          {/* Main Table Panel (centered, responsive) */}
          <div
            style={{
              flex: 2,
              minHeight: "60vh",
              background: "white",
              boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
              padding: "3rem",
              boxSizing: "border-box",
              overflowY: "auto",
              borderRadius: "8px",
              marginRight: `${RIGHT_WIDTH_TABLE + 24}px`, // ← ensures gap between table and fixed
            }}
          >
            {/* TABLE HEADER (centered) */}
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <h2 style={{ margin: 0 }}>Sequence List</h2>
            </div>

            <table style={{ borderCollapse: "collapse", border: "2px solid black", width: "100%" }}>
              <thead>
                <tr style={{ backgroundColor: "#e0e0e0" }}>
                  <th style={styles.th}>ID No.</th>
                  <th style={styles.th}>Domain Name (Brief)</th>
                  <th style={styles.th}>Sequence</th>
                  <th style={styles.th}>Additional Description</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, idx) => (
                  <tr key={idx} style={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td style={styles.td}>SEQ ID NO: {entry.seq_id}</td>
                    <td style={styles.td}>{formatDomainName(entry.domain_name)}</td>
                    <td style={styles.td}>{entry.sequence}</td>
                    <td style={styles.td}>{entry.user_provided_description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {error && (
              <div style={{ color: "red", marginTop: "1rem" }}>
                ❌ {error}
              </div>
            )}
          </div>

          {/* Right panel (resizes with screen) */}
          {/* <div
            style={{
              flex:"0 0 auto",
              display: "flex",
              justifyContent: "flex-end",
            }}
          > */}
            <div              
            style={{
                  position: "fixed",
                  top: `${HEADER_HEIGHT + 95}px`, // Adjust based on your header
                  right: "32px",
                  width: `${RIGHT_WIDTH}px`,
                  height: "215px",
                  background: "white",
                  borderRadius: "20px",
                  boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "16px",
                  boxSizing: "border-box",
                  zIndex: 900,
                }}
            >
              <div
                style={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "16px",
                  fontWeight: 500,
                  marginBottom: "8px",
                  textAlign: "left",
                  color: "#000",
                }}
              >
                Review the sequence table.<br />
                If everything looks correct,<br /> you're ready to generate your patent application.
              </div>
              <div
                className = "button-hover"
                onClick={handleGenerate}
                style={{
                  width: "100%",
                  height: "50px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  borderRadius: "6px",
                }}
              >
                <img
                  src={generateapplication}
                  alt="Generate Application"
                  style={{ height: "48px", width: "225px" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

const styles = {
  button: {
    marginLeft: "8px",
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  th: {
    padding: "10px",
    border: "1px solid #ccc",
    textAlign: "left",
    fontWeight: "bold",
    color: "#000",
  },
  td: {
    padding: "10px",
    border: "1px solid #ccc",
    wordBreak: "break-word",
    color: "#000",
  },
  rowEven: {
    backgroundColor: "#fff",
  },
  rowOdd: {
    backgroundColor: "#f9f9f9",
  },
};
