//------------without 24hour timer------------------
import { useEffect, useState } from 'react';
import { useRive } from '@rive-app/react-canvas';
import { auth, logout } from "../firebase";
import { useNavigate } from "react-router-dom";

const IntroSplash = () => {
  const user = auth.currentUser;
  const API_BASE = import.meta.env.VITE_API_BASE;
  const navigate = useNavigate();
  const [animationLoaded, setAnimationLoaded] = useState(false);

  const { RiveComponent } = useRive({
    src: '/antibody-webapp/keyora_intro_splash.riv',
    artboard: 'logo_fade',
    autoplay: true,
    onLoad: () => {
      setAnimationLoaded(true);
    },
  });

  useEffect(() => {
    if (animationLoaded) {
      const timer = setTimeout(() => {
        navigate('/login');
      }, 3000); // Adjust based on actual animation duration

      return () => clearTimeout(timer);
    }
  }, [animationLoaded, navigate]);

    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffffff", // optional
        }}
      >
        <div
          style={{
            width: "50vw",
            height: "50vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RiveComponent
            style={{
              backgroundColor: "transparent",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
    );
};

export default IntroSplash;
// // --------------- with 24Hour timer------------------
// import { useEffect, useState } from 'react';
// import { useRive } from '@rive-app/react-canvas';
// import { auth, logout } from "../firebase";
// import { useNavigate } from "react-router-dom";

// const SPLASH_KEY = 'Keyora_splashTimestamp';
// const SPLASH_DURATION = 3000; // 3 seconds

// const IntroSplash = () => {
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_BASE;
//   const user = auth.currentUser;
//   const [shouldShowSplash, setShouldShowSplash] = useState(false);

//   const { RiveComponent, rive } = useRive({
//     src: '/antibody-webapp/keyora_intro_splash.riv',
//     artboard: 'logo_fade',
//     autoplay: true,
//   });

//   useEffect(() => {
//     const lastSeen = localStorage.getItem(SPLASH_KEY);
//     const now = Date.now();

//     if (!lastSeen || now - parseInt(lastSeen) > 24 * 60 * 60 * 1000) {
//       // Show splash and update timestamp
//       setShouldShowSplash(true);
//       localStorage.setItem(SPLASH_KEY, now.toString());
//     } else {
//       // Skip splash
//       navigate('/login');
//     }
//   }, [navigate]);

//   useEffect(() => {
//     if (shouldShowSplash && rive) {
//       const timer = setTimeout(() => {
//         navigate('/login');
//       }, SPLASH_DURATION);

//       return () => clearTimeout(timer);
//     }
//   }, [shouldShowSplash, rive, navigate]);

//   if (!shouldShowSplash) return null;

//   return (
//     <div style={{ width: '100vw', height: '100vh', backgroundColor: '#fff' }}>
//       <RiveComponent />
//     </div>
//   );
// };

// export default IntroSplash;
