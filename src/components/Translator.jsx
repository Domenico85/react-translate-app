import React, { useState, useEffect } from "react";
import { auth } from "./firebase"; // Import firebase authentication
import axios from "axios";

const Translator = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [source, setSource] = useState("en");
  const [target, setTarget] = useState("it");
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("translationHistory")) || [];
    setHistory(savedHistory);

    // Check if the user is logged in
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
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
      const updatedHistory = [newEntry, ...history].slice(0, 5);
      setHistory(updatedHistory);
      localStorage.setItem("translationHistory", JSON.stringify(updatedHistory));

      // Save translation history to Firebase if user is logged in
      if (user) {
        const userRef = firebase.firestore().collection("users").doc(user.uid);
        await userRef.set({
          history: updatedHistory,
        });
      }
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

  const handleLogin = () => {
    const email = prompt("Enter your email:");
    const password = prompt("Enter your password:");
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        console.log("Logged in", userCredential.user);
      })
      .catch((error) => {
        console.error("Login error", error);
      });
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log("Logged out");
    });
  };

  return (
    <div className="container mt-5 p-4 shadow-lg rounded bg-light">
      {user ? (
        <div>
          <button className="btn btn-danger" onClick={handleLogout}>Log Out</button>
          <h2 className="text-center mb-4">Welcome, {user.email}</h2>
        </div>
      ) : (
        <button className="btn btn-primary" onClick={handleLogin}>Log In</button>
      )}

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
