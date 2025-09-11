import React from "react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendReset: (email: string) => void;
  email: string;
  setEmail: (email: string) => void;
  error: string | null;
  modalState: "input" | "success";
  setModalState: (state: "input" | "success") => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSendReset,
  email,
  setEmail,
  error,
  modalState,
  setModalState,
}) => {
  if (!isOpen) return null;

  const isEmailEntered = email.trim().length > 0;

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "white",
        padding: "24px",
        borderRadius: "8px",
        width: "396px",
        height: "278px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
        color: "#000"
      }}>
        
        {modalState === "input" ? (
        <div style={{ width: "300px", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <p style={{ fontSize: "16px", textAlign: "left", marginBottom: "24px", lineHeight: "1.4" }}>
            Enter your email address to retrieve <br /> your password
            </p>
            <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
                width: "100%",
                height: "48px",
                padding: "0 12px",
                fontSize: "16px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#F0F1F1",
                color: "#000",
                marginBottom: "16px",
                boxSizing: "border-box",
                outline: "none",
            }}
            />
            {error && (
              <p style={{ color: "red", fontSize: "16px",marginTop: "4px", marginBottom:0 }}>
                Invalid email, try again.
              </p>
            )}
            <div style={{ display: "flex", justifyContent: "center", width: "100%", gap: "12px", marginTop: "24px"}}>
            <button
                className = "button-hover"
                onClick={onClose}
                style={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                padding: "8px 16px",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer",
                color: "#000"
                }}
            >
                Cancel
            </button>
            <button
                className = "button-hover"
                onClick={() => onSendReset(email)}
                disabled={!email.trim()}
                style={{
                backgroundColor: email.trim() ? "#007bff" : "#ccc",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: email.trim() ? "pointer" : "not-allowed"
                }}
            >
                Submit
            </button>
            </div>
        </div>
        ) : (

          <>
            <p style={{ fontSize: "20px", font: "Inter", textAlign: "left", marginBottom: "24px",marginLeft: "48px",marginTop: "30px", marginRight: "48px"}}>
              Your password has been emailed to {email}
            </p>
            <div style={{ display: "flex", justifyContent: "left", marginTop: "24px" }}>
              <button
                className = "button-hover"
                onClick={onClose}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor: "pointer"
                }}
              >
                OK
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
