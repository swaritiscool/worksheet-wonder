'use client'
import { useRouter } from 'next/navigation';
import styles from "./page.module.css";
import { ButtonLong } from "@/components/buttonLong.jsx";
import Input from "@/components/inputs.jsx";
import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react"
import Main_Editor from "@/components/markdownComponent"
import UtilsButton from "@/components/utils_button"
import ButtonLongHot from "@/components/hot_button"
import Card from "@/components/card"
import { supabase } from '@/supabase/client'
import { useCredits } from "@/hooks/useCredits"

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [board, setBoard] = useState("")
  const [answerKey, setAnswerKey] = useState("")
  const [grade, setGrade] = useState("")
  const [instructions, setInstructions] = useState("")
  const [difficulty, setDifficulty] = useState("")
  const [prompt, setPrompt] = useState("");
  const socketRef = useRef(null);
  const [contentVersion, setContentVersion] = useState(0)
  const [contentVersion2, setContentVersion2] = useState(0)
  const editor = useRef(null)
  const answerEditor = useRef(null)
  const [changed, setChanged] = useState(false)
  const router = useRouter()
  const [error, setError] = useState("")
  const [wsList, setWsList] = useState([])
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  
  // Credits hook
  const { credits, loading: creditsLoading, error: creditsError, deduct } = useCredits(user?.id)

  useEffect(() => {
    connectWebSocket();
    const fetchWS = async () => {
      const list = []
      console.log("List:", list)
      setWsList(list.items)
    }
    fetchWS()
  }, [])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Auth check failed:', error)
          router.push('/auth')
          return
        }
        if (!session) {
          router.push('/auth')
          return
        }
        
        setUser(session.user)
        console.log("ID: ", session.user.id)
        setIsAuthLoading(false)
      } catch (error) {
        console.error('Unexpected error during auth check:', error)
        router.push('/auth')
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    setPrompt(`Generate a worksheet for this : ${title} for ${grade} with a difficulty of ${difficulty}. Extra instructions: ${instructions}. Include Answer Key: ${answerKey}. Board: ${board}`)
  }, [title, grade, instructions, difficulty, answerKey])

  const connectWebSocket = () => {
    if (!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED) {
      socketRef.current = new WebSocket("http://localhost:8080/");

      socketRef.current.onopen = () => {
        console.log("✅ WebSocket connected");
      };

      socketRef.current.onmessage = (event) => {
        console.log("📩 Response from server:", event.data);
        const newMarkdown = event.data;
        setTimeout(() => {
          editor.current = newMarkdown; // Sync immediately
          setChanged(true)
          setContentVersion((v) => v + 1);
          setLoading(false)
        }, 100);
      };

      socketRef.current.onerror = (error) => {
        console.error("❌ WebSocket error:", error);
        setLoading(false) // Stop loading on error
      };

      socketRef.current.onclose = () => {
        console.warn("⚠️ WebSocket closed. Reconnecting in 2s...");
        setTimeout(connectWebSocket, 2000);
      };
    }
  };

  const make_req = (fin_send_prompt) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ fin_send_prompt }));
      console.log("📤 Prompt sent:", fin_send_prompt);
    } else {
      console.warn("⚠️ WebSocket not ready. Try again shortly.");
      setLoading(false)
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!title || !grade || !difficulty || !answerKey) {
      setError("Please Fill All The Fields");
      return;
    }

    const costPerGeneration = 10; // 10 credits per worksheet generation
    
    // Check if user has enough credits
    if (credits < costPerGeneration) {
      setError("Insufficient credits! You need at least 5 credits to generate a worksheet.");
      return;
    }

    try {
      setLoading(true);
      
      // Deduct credits first
      const result = await deduct(costPerGeneration);
      
      if (!result.success) {
        setError('Failed to deduct credits: ' + (result.error?.message || result.error));
        setLoading(false);
        return;
      }

      // Generate the worksheet
      make_req(prompt);
      
    } catch (error) {
      console.error('Generation failed:', error);
      setError('Generation failed. Please try again.');
      setLoading(false);
      // Optionally refund credits on failure
      // await add(costPerGeneration);
    }
  }

  // Show loading while checking auth or credits
  if (isAuthLoading || creditsLoading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h2 style={{color: "#fff"}}>Loading...</h2>
      </div>
    );
  }

  function newWorksheet() {
    const userConfirmed = window.confirm(
      "Are you sure you want to make a new worksheet? The current one will not be saved."
    );
    if (userConfirmed) {
      window.location.reload();
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.sidebar}>
        <div className={styles.settings}>
          <p style={{fontWeight: "400"}}>Credits Left: {credits}</p>
          <div style={{alignSelf: "right", display: 'flex', flexDirection: 'row', gap: "30px"}}>
            <UtilsButton symbol="/add.svg" alt="increase credits" onClick={() => {router.push("/get-more-credits")}} />
            <UtilsButton symbol="/gear.svg" alt="settings" onClick={() => {router.push("/settings")}} />
          </div>
        </div>
        <div className={styles.sideList}>
        </div>
      </div>
      <div className={styles.main}>
        {error != "" && (
          <p style={{color: "#fe0", alignSelf: "center", fontWeight: 600}}>{error}</p>
        )}
        {creditsError && (
          <p style={{color: "#fe0", alignSelf: "center", fontWeight: 600}}>
            Credit Error: {creditsError.message || JSON.stringify(creditsError)}
          </p>
        )}
        <div className={styles.inputs}>
          <ButtonLong 
            title={`Generate Worksheet (${credits >= 10 ? '10 credits' : 'Insufficient credits'})`} 
            onPress={handleSubmit} 
            style={{alignSelf: "start"}}
          />
          <Input title="Title*" onChange={(e) => {setTitle(e.target.value)}} placeholder="Eg: Title of your worksheet"/>
          <div style={{display: "flex"}}>
            <Input style={{width: "95%"}} title="Grade Level*" onChange={(e) => {setGrade(e.target.value)}} placeholder="Eg: 3rd Grade" />
            <Input style={{width: "95%"}} title="Board" onChange={(e) => {setBoard(e.target.value)}} placeholder="Eg: CBSE" />
          </div>
          <div style={{display: "flex"}}>
            <Input style={{width: "95%"}} title="Difficulty*" onChange={(e) => {setDifficulty(e.target.value)}} placeholder="Eg: Hard / Easy / Moderately Hard" />
            <Input style={{width: "95%"}} title="Include Answer Key*" onChange={(e) => {setAnswerKey(e.target.value)}} placeholder="Eg: Yes/No"/>
          </div>
          <Input title="Instructions" onChange={(e) => {setInstructions(e.target.value)}} placeholder="Eg: Extra instructions" />
        </div>
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <motion.div
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: "#fff",
                borderRadius: "10px",
              }}
              animate={{ x: 100 }}
              transition={{
                type: "spring",
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
          </div>
        )}
        <div className={styles.MD_Parent}>
          <UtilsButton symbol="/copy.svg" alt="copy" onClick={null} style={{marginBottom: "20px"}} />
          <Main_Editor
            key={contentVersion}
            markdown={editor.current != null ? editor.current : ""}
            onChange={(md, initial) => {
              editor.current = md;
            }}
          />
        </div>
      </div>
    </div>
  );
}
