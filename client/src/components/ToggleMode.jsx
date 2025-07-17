import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ToggleMode = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
        marginLeft: "auto",
      }}
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? <FaSun color="#facc15" /> : <FaMoon color="#64748b" />}
    </button>
  );
};

export default ToggleMode;
