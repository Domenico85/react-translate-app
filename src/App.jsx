import { useState, useEffect } from "react";
import Translator from "./components/Translator";


const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) {
      setDarkMode(JSON.parse(savedMode));
    }
  }, []);

  useEffect(() => {
   
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <div className={`App ${darkMode ? "dark" : "light"}`}>
      <button className="btn btn-secondary m-3" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "🌙 Light Mode" : "🌞 Dark Mode"}
      </button>
      <Translator />
    </div>
  );
};

export default App;
