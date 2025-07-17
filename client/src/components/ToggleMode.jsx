// Import React hooks and icons
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const ToggleMode = () => {
  // State to track if dark mode is enabled; initializes from localStorage
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Side effect to update the DOM and localStorage whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      // Apply dark mode class to the <body> and save preference
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      // Remove dark mode class and save preference
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]); // Runs whenever `darkMode` changes

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      style={{
        background: "none", // Remove button background
        border: "none", // Remove button border
        cursor: "pointer", // Cursor changes to pointer on hover
        fontSize: "20px", // Icon size
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "20px",
        marginLeft: "auto", // Push to the right in flex container
      }}
      aria-label="Toggle Dark Mode" // Improves accessibility
    >
      {/* Show sun icon if dark mode is on, otherwise moon icon */}
      {darkMode ? <FaSun color="#facc15" /> : <FaMoon color="#64748b" />}
    </button>
  );
};

export default ToggleMode;
