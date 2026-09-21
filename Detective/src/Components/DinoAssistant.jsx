import { useEffect, useState } from 'react'
import avatar from '../assets/images/rex-avatar.png'
export default function DinoAssistant({ message, voice = false }) {
  const [speaking, setSpeaking] = useState(false)
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  useEffect(() => () => { if (supported) window.speechSynthesis.cancel() }, [supported])
  function speak() {
    window.speechSynthesis.cancel()
    if (speaking) { setSpeaking(false); return }
    const utterance = new SpeechSynthesisUtterance(message)
    utterance.lang = 'es-ES'
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utterance)
  }
  return <aside className="dino-assistant"><img className="rex-avatar" src={avatar} alt="Rex" /><div><strong>DINO REX TRANSMITIENDO:</strong><p>“{message}”</p>{voice && supported && <button className="voice-button" onClick={speak} aria-pressed={speaking}>{speaking ? 'Detener voz' : 'Escuchar voz táctica'}</button>}</div></aside>
}
