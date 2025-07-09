'use client'
import Image from "next/image";
import styles from "./page.module.css";
import Main_Editor from "./text_area_editor.jsx";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [title, setTitle] = useState("")
  const [title, setTitle] = useState("")
  const [title, setTitle] = useState("")
  const [title, setTitle] = useState("")
  const socketRef = useRef(null);
  const [contentVersion, setContentVersion] = useState(0) 
  const editor = useRef(null)
  const [changed, setChanged] = useState(false)
  useEffect(() => {
    connectWebSocket();
  }, []);

  const connectWebSocket = () => {
    if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
      socketRef.current = new WebSocket("https://caught-thrown-amanda-fed.trycloudflare.com");

      socketRef.current.onopen = () => {
        console.log("✅ WebSocket connected");
      };

      socketRef.current.onmessage = (event) => {
        console.log("📩 Response from server:", event.data);
        const newMarkdown = event.data;
        editor.current = newMarkdown; // Sync immediately
        setChanged(true)
        setContentVersion((v) => v + 1);
      };

      socketRef.current.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
      };

      socketRef.current.onclose = () => {
        console.warn("⚠️ WebSocket closed. Reconnecting in 2s...");
        setTimeout(connectWebSocket, 2000);
      };
    }
  };

  const make_req = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ prompt }));
      console.log("📤 Prompt sent:", prompt);
    } else {
      console.warn("⚠️ WebSocket not ready. Try again shortly.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    make_req();
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <form className={styles.TopBar} onSubmit={handleSubmit}>
          <input
            type="text"
            name="Prompt"
            placeholder="Generate a worksheet about ..."
            className={styles.PromptBar}
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
          />
          <button type="submit" className={styles.button}>Generate WS</button>
        </form>
        <div className={styles.Main}>
          <Main_Editor
            key={contentVersion}
            markdown={editor.current != null ? editor.current : ""}
            onChange={(md, initial) => {
              editor.current = md;
            }}
          />
        </div>
      </main>
    </div>
  );
}

