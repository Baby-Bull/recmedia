import React from "react";

const SplashScreen = () => (
  <div
    style={{
      width: "100%",
      height: "100%",
      position: "fixed",
      top: 0,
      left: 0,
      display: "flex",
      zIndex: 999,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignContent: "center",
      alignItems: "center",
    }}
  >
    <img alt="splash" src="/assets/images/bg_loading.gif" style={{ width: "20%" }} />
  </div>
);
export default SplashScreen;
