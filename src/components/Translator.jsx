import { useState } from "react";
import { translateText } from "../api/lingva";

const Translator = () => {
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [source, setSource] = useState("en");
    const [target, setTarget] = useState("it");

    const handleTranslate = async () => {
        const translation = await translateText(input, source, target);
        setOutput(translation);
    };

    return (
        <div className="container mt-4">
            <h2>Language Translator</h2>
            <div className="mb-3">
                <select value={source} onChange={(e) => setSource(e.target.value)}>
                    <option value="en">English</option>
                    <option value="it">Italian</option>
                    <option value="fr">French</option>
                </select>
                <span> → </span>
                <select value={target} onChange={(e) => setTarget(e.target.value)}>
                    <option value="it">Italian</option>
                    <option value="en">English</option>
                    <option value="fr">French</option>
                </select>
            </div>
            <textarea
                className="form-control mb-3"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type text here..."
            />
            <button className="btn btn-primary" onClick={handleTranslate}>Translate</button>
            <h3 className="mt-3">{output}</h3>
        </div>
    );
};

export default Translator;
