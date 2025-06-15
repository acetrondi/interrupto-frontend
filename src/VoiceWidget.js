"use client";

import { usePorcupine } from "@picovoice/porcupine-react";
import { useEffect, useState } from "react";
import heyMiraKeywordModel from "./hey_mira";
import modelParams from "./porcupine_params";

export default function VoiceWidget() {
  const [keywordDetections, setKeywordDetections] = useState([]);

  const { keywordDetection, isLoaded, isListening, error, init, start, stop, release } =
    usePorcupine();

  const initEngine = async () => {
    await init(
      "yuPLId0OSFu9srGavorl/4BvfJWqEhBQyJrb66FLkWSGHqhR20WOVA==",
      {
        publicPath: `../public/Hey-Mira_en_wasm_v3_0_0.ppn`,
        // base64: heyMiraKeywordModel,
        label: "Hey Mira",
      },
      { 
        // base64: modelParams,
        publicPath: `../public/porcupine_params.pv`
       }
    );
    start();
  };

  useEffect(() => {
    if (error) {
      console.error("Porcupine Error:", error);
    }
  }, [error]);

  useEffect(() => {
    if (keywordDetection !== null) {
      setKeywordDetections((oldVal) => [...oldVal, keywordDetection.label]);
    }
  }, [keywordDetection]);

  return (
    <div className="voice-widget">
      <h3>
        <label>
          <button className="init-button" onClick={() => initEngine()}>
            Start
          </button>
        </label>
      </h3>
      {keywordDetections.length > 0 && (
        <ul>
          {keywordDetections.map((label, index) => (
            <li key={index}>{label}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
