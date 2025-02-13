import React, { useState, useEffect } from "react";
import axios from "axios";

const Translator = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [source, setSource] = useState("en");
  const [target, setTarget] = useState("it");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Load the translation history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem("translationHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const translateText = async (text, sourceLang, targetLang) => {
    try {
      const response = await axios.get(`https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(text)}`);
      return response.data.translation;
    } catch (error) {
      console.error("Translation error:", error);
      return "Error fetching translation";
    }
  };

  const handleTranslate = async () => {
    const translation = await translateText(input, source, target);
    setOutput(translation);

    if (translation) {
      const newEntry = { input, translation, source, target };
      const updatedHistory = [newEntry, ...history].slice(0, 5); // Keep only the last 5 translations
      setHistory(updatedHistory);
      localStorage.setItem("translationHistory", JSON.stringify(updatedHistory)); // Save to localStorage
    }
  };

  const speak = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    } else {
      alert("Text-to-Speech is not supported in this browser.");
    }
  };

  return (
    <div className="container mt-5 p-4 shadow-lg rounded bg-light">
      <h2 className="text-center mb-4">🌍 Language Translator</h2>

      <div className="input-group mb-3">
        <select className="form-select" value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="en">English</option>
          <option value="it">Italian</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
        </select>
        <span className="input-group-text">→</span>
        <select className="form-select" value={target} onChange={(e) => setTarget(e.target.value)}>
          <option value="it">Italian</option>
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
        </select>
      </div>

      <textarea
        className="form-control mb-3"
        rows="3"
        placeholder="Enter text to translate..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>

      <button className="btn btn-primary w-100" onClick={handleTranslate}>Translate</button>

      {output && (
        <div className="alert alert-info mt-3">
          <h4>Translation:</h4>
          <p className="lead">{output}</p>
          <button className="btn btn-success" onClick={() => speak(output, target)}>
            🔊 Listen
          </button>
        </div>
      )}

      <h4 className="mt-4">Translation History</h4>
      <ul className="list-group">
        {history.map((item, index) => (
          <li key={index} className="list-group-item">
            <strong>{item.input}</strong> ({item.source} → {item.target}): {item.translation}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Translator;
