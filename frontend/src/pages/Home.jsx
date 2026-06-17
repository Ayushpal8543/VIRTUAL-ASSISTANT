
import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { userDataContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import ParticleBackground from '../components/ParticleBackground'  

function Home() {
  const { userData, serverUrl, setUserData } = useContext(userDataContext)
  const navigate = useNavigate()
  const [userText, setUserText] = useState("")
  const [aiText, setAiText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [isSpeakingState, setIsSpeakingState] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [history, setHistory] = useState([])
  const recognitionRef = useRef(null)
  const isSpeakingRef = useRef(false)
  const preferredLangRef = useRef('en-US') 

  const handleLogOut = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
      setUserData(null)
      navigate("/signin")
    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }  

  const speak = (text, lang = 'en-US') => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = lang
    utterance.rate = 1
    utterance.pitch = 1  
    utterance.onstart = () => {
      isSpeakingRef.current = true
      setIsSpeakingState(true)
      setIsListening(false)
      recognitionRef.current?.stop()
    }  
    utterance.onend = () => {
      isSpeakingRef.current = false
      setIsSpeakingState(false)
      setAiText("")
      setUserText("")
      recognitionRef.current?.start()
    }  
    window.speechSynthesis.speak(utterance)
  }

  const handleCommand = (data) => {
    const { type, userInput, response, query, location, language, text, appName, lang } = data  // ✅ 'dat' → 'data'
    setAiText(response)  
    setHistory(prev => [...prev, {
      user: userInput,
      ai: response,
      time: new Date().toLocaleTimeString()
    }])
    if (lang) preferredLangRef.current = lang
    speak(response, lang || preferredLangRef.current) 

    const openUrl = (url) => {
       const a = document.createElement('a')
       a.href = url
       a.target = '_blank'
       a.rel = 'noreferrer'
       document.body.appendChild(a)
       a.click()
       document.body.removeChild(a)
      
    }

    if (type === 'google_search') openUrl(`https://www.google.com/search?q=${encodeURIComponent(query || userInput)}`)
    if (type === 'youtube_search') openUrl(`https://www.youtube.com/results?search_query=${encodeURIComponent(query || userInput)}`)
//     if (type === 'youtube_play') {
//   const url = data.videoUrl ||
//     `https://www.youtube.com/results?search_query=${encodeURIComponent(query || userInput)}`
//   openUrl(url)
//    console.log("YouTube Data:", data)
// }
    if (type === 'youtube_play') {
  console.log("FULL DATA =", data)
  console.log("VIDEO URL =", data.videoUrl)

  openUrl(data.videoUrl)
}
    if (type === 'calculator_open') openUrl('https://www.google.com/search?q=calculator')
    if (type === 'instagram_open') openUrl('https://www.instagram.com')
    if (type === 'facebook_open') openUrl('https://www.facebook.com')
    if (type === 'twitter_open') openUrl('https://www.twitter.com')
    if (type === 'whatsapp_open') openUrl('https://web.whatsapp.com')
    if (type === 'maps_open') openUrl(`https://www.google.com/maps/search/${encodeURIComponent(location || userInput)}`)
    if (type === 'weather_show') openUrl(`https://www.google.com/search?q=weather+${encodeURIComponent(location || userInput)}`)
    if (type === 'news_show') openUrl('https://news.google.com')
    if (type === 'spotify_open') openUrl(`https://open.spotify.com/search/${encodeURIComponent(query || userInput)}`)
    if (type === 'translate') openUrl(`https://translate.google.com/?sl=auto&tl=${language || 'en'}&text=${encodeURIComponent(text || userInput)}`)
    if (type === 'email_open') openUrl('https://mail.google.com')
    if (type === 'notes_open') openUrl('https://keep.google.com')
    if (type === 'app_open') openUrl(`https://www.google.com/search?q=${encodeURIComponent(appName || userInput)}`)
  }  

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognitionRef.current = recognition
    recognition.continuous = true
    recognition.lang = 'en-US'  
     recognition.onresult = async (e) => {
       const transcript = e.results[e.results.length - 1][0].transcript.trim()
       console.log("heard: " + transcript)
       if (isSpeakingRef.current) return  
       setIsListening(true)
       setUserText(transcript)  
       if (transcript.toLowerCase().includes(userData.assistantName.toLowerCase())) {
         try {
           const result = await axios.post(
             `${serverUrl}/api/user/asktoassistant`,
             { command: transcript, currentLang: preferredLangRef.current },
             { withCredentials: true }
           )
           console.log("Response:", result.data)
           setIsListening(false)
           handleCommand(result.data)
         } catch (error) {
           console.log("Error:", error)
           setIsListening(false)
         }
       } else {
         setTimeout(() => setIsListening(false), 1500)
       }
     }  
    recognition.onend = () => { if (!isSpeakingRef.current) recognition.start() }
    recognition.onerror = (e) => {
      if (e.error !== 'aborted' && !isSpeakingRef.current) recognition.start()
    }
    recognition.start()
    return () => { recognition.onend = null; recognition.abort() }
  }, [userData, serverUrl])  

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-black to-[#02023d] flex flex-col items-center justify-center px-4 py-6 gap-[20px]" style={{ position: 'relative', overflow: 'hidden' }}>  {/* ✅ closing > fix */}
      <ParticleBackground />
      <style>{`
        @keyframes mic-pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.7); }
          50% { box-shadow: 0 0 0 20px rgba(59,130,246,0); }
        }
        @keyframes circle-wave {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes wave-bar {
          0%,100% { transform: scaleY(0.4); opacity: 0.4; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>  

      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{
          position: 'fixed', inset: 0,
          backdropFilter: 'blur(6px)',
          background: 'rgba(0,0,0,0.4)',
          zIndex: 40
        }} />
      )}  

      {menuOpen && (
        <div style={{
          position: 'fixed', top: 0, right: 0,
          width: '300px', height: '100vh',
          background: 'rgba(10,10,40,0.95)',
          borderLeft: '1px solid rgba(59,130,246,0.3)',
          zIndex: 50,
          display: 'flex', flexDirection: 'column',
          padding: '24px', gap: '16px',
          animation: 'slide-in 0.3s ease',
          boxShadow: '-10px 0 40px rgba(0,0,80,0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setMenuOpen(false)} style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%', width: '36px', height: '36px',
              color: 'white', fontSize: '18px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>✕</button>
          </div>  

          <div style={{ textAlign: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <p style={{ color: 'white', fontWeight: 'bold', fontSize: '16px', margin: 0 }}>{userData?.name}</p>
            <p style={{ color: '#93c5fd', fontSize: '12px', margin: '4px 0 0' }}>{userData?.email}</p>
          </div>  {/* ✅ closing > fix */}

          <button onClick={() => { navigate("/Customize"); setMenuOpen(false) }} style={{
            width: '100%', padding: '14px',
            background: 'rgba(59,130,246,0.2)',
            border: '1px solid rgba(59,130,246,0.5)',
            borderRadius: '12px', color: 'white', fontSize: '15px',
            cursor: 'pointer', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>🎨 Customize Assistant</button>  

          <button onClick={handleLogOut} style={{
            width: '100%', padding: '14px',
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '12px', color: '#fca5a5', fontSize: '15px',
            cursor: 'pointer', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>🚪 Log Out</button>  {/* ✅ closing > fix */}

          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <p style={{ color: '#93c5fd', fontSize: '13px', fontWeight: '600', margin: 0 }}>📜 History</p>
              {history.length > 0 && (
                <button onClick={() => setHistory([])} style={{
                  background: 'none', border: 'none',
                  color: '#ef4444', fontSize: '11px', cursor: 'pointer'
                }}>Clear</button>
              )}
            </div> 
            <div style={{
              flex: 1, overflowY: 'auto',
              display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px'
            }}>
              {history.length === 0 ? (
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textAlign: 'center', marginTop: '20px' }}>
                  Koi history nahi abhi
                </p>
              ) : (
                [...history].reverse().map((item, i) => (
                  <div key={i} style={{
                    background: 'rgba(255,255,255,0.05)', borderRadius: '10px',
                    padding: '10px', borderLeft: '3px solid rgba(59,130,246,0.5)'
                  }}>
                    <p style={{ color: '#93c5fd', fontSize: '11px', margin: '0 0 4px' }}>🎤 {item.user}</p>
                    <p style={{ color: '#c4b5fd', fontSize: '11px', margin: '0 0 4px' }}>🤖 {item.ai}</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', margin: 0 }}>{item.time}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}  

      <button onClick={() => setMenuOpen(true)} style={{
        position: 'absolute', top: '20px', right: '20px',
        background: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '10px', width: '46px', height: '46px',
        cursor: 'pointer', zIndex: 30,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '5px'
      }}>
        <div style={{ width: '20px', height: '2px', background: 'white', borderRadius: '2px' }} />
        <div style={{ width: '20px', height: '2px', background: 'white', borderRadius: '2px' }} />
        <div style={{ width: '20px', height: '2px', background: 'white', borderRadius: '2px' }} />
      </button>  

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '300px', height: '380px',
          borderRadius: '20px', overflow: 'hidden',
          boxShadow: isListening
            ? '0 0 30px 10px rgba(59,130,246,0.6), 0 0 60px 20px rgba(59,130,246,0.3)'
            : isSpeakingState
            ? '0 0 30px 10px rgba(167,139,250,0.6), 0 0 60px 20px rgba(167,139,250,0.3)'
            : 'none',
          transition: 'box-shadow 0.4s ease'
        }}>
          <img src={userData.assistantImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>  

        {isListening && (
          <div style={{
            position: 'absolute', top: '-15px', right: '-15px',
            width: '50px', height: '50px', borderRadius: '50%',
            background: 'rgba(59,130,246,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'mic-pulse 1s ease-in-out infinite', zIndex: 10
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2" width="6" height="11" rx="3"/>
              <path d="M5 10a7 7 0 0 0 14 0"/>
              <line x1="12" y1="19" x2="12" y2="22"/>
              <line x1="8" y1="22" x2="16" y2="22"/>
            </svg>
          </div>
        )}  

        {isSpeakingState && (
          <div style={{ position: 'relative', marginTop: '16px', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {[0, 0.3, 0.6].map((delay, i) => (
              <div key={i} style={{
                position: 'absolute', width: '60px', height: '60px',
                borderRadius: '50%', border: '2px solid rgba(167,139,250,0.7)',
                animation: `circle-wave 1.5s ease-out infinite ${delay}s`,
              }} />
            ))}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '24px' }}>
              {[10, 18, 14, 22, 14, 18, 10].map((h, i) => (
                <div key={i} style={{
                  width: '3px', height: h + 'px', borderRadius: '2px',
                  background: '#a78bfa', transformOrigin: 'bottom',
                  animation: `wave-bar 0.8s ease-in-out infinite ${i * 0.1}s`
                }} />
              ))}
            </div>
          </div>
        )}
      </div>  

      <h1 className='text-white text-[18px] font-semibold relative z-10'>I'm {userData?.assistantName}</h1> 

      {userText && (
        <div style={{
          position: 'relative', zIndex: 1,
          background: 'rgba(59,130,246,0.15)',
          border: '1px solid rgba(59,130,246,0.4)',
          borderRadius: '12px', padding: '10px 16px',
          maxWidth: '350px', textAlign: 'center'
        }}>
          <p style={{ color: '#93c5fd', fontSize: '14px', margin: 0 }}>🎤 {userText}</p>
        </div>
      )}  

      {aiText && (
        <div style={{
          position: 'relative', zIndex: 1,
          background: 'rgba(167,139,250,0.15)',
          border: '1px solid rgba(167,139,250,0.4)',
          borderRadius: '12px', padding: '10px 16px',
          maxWidth: '350px', textAlign: 'center'
        }}>
          <p style={{ color: '#c4b5fd', fontSize: '14px', margin: 0 }}>🤖 {aiText}</p>
        </div>
      )}
    </div>
  )
}

export default Home
