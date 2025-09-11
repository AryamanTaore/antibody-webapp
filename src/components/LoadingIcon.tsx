// src/components/LoadingIcon.tsx
import { useRive } from "@rive-app/react-canvas";

const LoadingIcon = () => {
  const { RiveComponent } = useRive({
    src: "/antibody-webapp/keyora_intro_splash.riv", // adjust if needed
    artboard: "process",
    autoplay: true,
  });

  return (
    <RiveComponent
      style={{
        width: "200px",
        height: "200px",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
};

export default LoadingIcon;
