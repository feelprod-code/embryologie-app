import { useState, useRef, useCallback } from 'react';

type VoiceStatus = 'idle' | 'connecting' | 'connected' | 'error';

interface UseGeminiLiveOptions {
  language: string;
  courseContext: string;
  onTranscript?: (role: 'user' | 'assistant', text: string) => void;
}

export function useGeminiLive({ language, courseContext, onTranscript }: UseGeminiLiveOptions) {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  
  // Audio context for recording (16kHz) and playback (24kHz)
  const recordCtxRef = useRef<AudioContext | null>(null);
  const playbackCtxRef = useRef<AudioContext | null>(null);
  
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Playback queue variables
  const nextPlayTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Convert float32 array to 16-bit PCM Int16Array
  const floatTo16BitPCM = (float32Array: Float32Array): Int16Array => {
    const buffer = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      buffer[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return buffer;
  };

  // Convert 16-bit PCM ArrayBuffer to Float32Array for Web Audio API
  const pcmToFloat32 = (int16Array: Int16Array): Float32Array => {
    const float32 = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32[i] = int16Array[i] / 32768.0;
    }
    return float32;
  };

  // Convert ArrayBuffer to Base64
  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  // Convert Base64 to Int16Array
  const base64ToInt16 = (base64: string): Int16Array => {
    const binary = window.atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new Int16Array(bytes.buffer);
  };

  // Stop current speech playback (interrupt)
  const stopPlayback = useCallback(() => {
    activeSourcesRef.current.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Source might have already stopped
      }
    });
    activeSourcesRef.current = [];
    nextPlayTimeRef.current = 0;
  }, []);

  const disconnect = useCallback(() => {
    console.log("Deconnexion du tuteur vocal Gemini...");
    
    // Stop recording processor
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (micSourceRef.current) {
      micSourceRef.current.disconnect();
      micSourceRef.current = null;
    }
    
    // Stop mic stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Stop and clear audio nodes
    stopPlayback();

    // Close audio contexts
    if (recordCtxRef.current) {
      recordCtxRef.current.close();
      recordCtxRef.current = null;
    }
    if (playbackCtxRef.current) {
      playbackCtxRef.current.close();
      playbackCtxRef.current = null;
    }

    setStatus('idle');
  }, [stopPlayback]);

  const connect = useCallback(async () => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_OPENROUTER_API_KEY; 
    
    if (!apiKey) {
      setError("Clé d'API VITE_GEMINI_API_KEY non configurée dans le fichier .env.local.");
      setStatus('error');
      return;
    }

    setStatus('connecting');
    setError(null);

    try {
      // 1. Establish WebSocket connection to Gemini Multimodal Live API
      // We use v1alpha for the BidiGenerateContent live stream API
      const wsUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Initialize audio contexts
      const recordCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      recordCtxRef.current = recordCtx;
      const playbackCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      playbackCtxRef.current = playbackCtx;

      ws.onopen = async () => {
        console.log("Connecté à Gemini Live API. Envoi de la configuration...");
        
        // 2. Send Setup Message
        const langNames: Record<string, string> = {
          fr: 'FRANÇAIS', en: 'ANGLAIS', es: 'ESPAGNOL',
          it: 'ITALIEN', de: 'ALLEMAND', zh: 'CHINOIS',
          ja: 'JAPONAIS'
        };
        const langName = langNames[language.substring(0, 2)] || 'FRANÇAIS';

        const instructions = `Tu es "Embryo AI", un tuteur vocal expert en embryologie biodynamique, basé prioritairement sur les enseignements de Marc Damoiseaux.
RÈGLE D'OR ABSOLUE : Tu dois parler STRICTEMENT ET UNIQUEMENT en ${langName}. Ne mélange jamais les langues.
Instaure un vrai dialogue (questions/réponses) pour développer la réflexion. 

Comportement attendu :
1. Réponds DIRECTEMENT en te basant sur le cours de Marc Damoiseaux ci-dessous.
2. Pose une petite question à la fin pour relancer la discussion et inviter l'utilisateur à approfondir.
3. Si l'information n'est pas dans le cours, dis-le clairement, puis ajoute très brièvement : "Je peux compléter avec mes autres bases (Blechschmidt, Jealous, etc.) ou chercher sur internet si tu veux. Qu'en dis-tu ?"
4. Sois très concis et fluide (2-3 phrases max par prise de parole). Parle naturellement sans hésitations ni listes.

CONTEXTE DU COURS :
${courseContext.substring(0, 8000)}`;

        const setupMessage = {
          setup: {
            model: "models/gemini-2.0-flash-exp",
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Puck" // Clear, natural voice
                  }
                }
              }
            },
            systemInstruction: {
              parts: [{ text: instructions }]
            }
          }
        };

        ws.send(JSON.stringify(setupMessage));

        // 3. Start microphone recording
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const micSource = recordCtx.createMediaStreamSource(stream);
        micSourceRef.current = micSource;

        // Use ScriptProcessor for capturing raw float32 at 16kHz (automatically downsampled by the AudioContext)
        const processor = recordCtx.createScriptProcessor(2048, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return;

          const inputData = e.inputBuffer.getChannelData(0);
          const pcm16 = floatTo16BitPCM(inputData);
          const base64Audio = arrayBufferToBase64(pcm16.buffer as ArrayBuffer);

          // Stream audio to Gemini
          ws.send(JSON.stringify({
            realtimeInput: {
              mediaChunks: [
                {
                  mimeType: "audio/pcm;rate=16000",
                  data: base64Audio
                }
              ]
            }
          }));
        };

        micSource.connect(processor);
        processor.connect(recordCtx.destination);
        
        setStatus('connected');
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          // A. Handle model audio output
          if (message.serverContent?.modelTurn?.parts) {
            for (const part of message.serverContent.modelTurn.parts) {
              if (part.inlineData && part.inlineData.mimeType.startsWith('audio/pcm')) {
                const base64Data = part.inlineData.data;
                const pcm16 = base64ToInt16(base64Data);
                const float32 = pcmToFloat32(pcm16);
                
                // Play audio chunk
                playAudioChunk(float32);
              }
            }
          }

          // B. Handle interruption (barge-in)
          if (message.serverContent?.interrupted) {
            console.log("Modèle interrompu par l'utilisateur (barge-in)");
            stopPlayback();
          }

          // C. Handle transcriptions (for UI updates)
          if (message.serverContent?.modelTurn?.parts) {
            // Check if there is text transcript or if we should reconstruct it
            const textParts = message.serverContent.modelTurn.parts
              .filter((p: any) => p.text)
              .map((p: any) => p.text)
              .join('');
            if (textParts) {
              onTranscript?.('assistant', textParts);
            }
          }
        } catch (e) {
          console.error("Error processing Gemini live WebSocket message:", e);
        }
      };

      ws.onerror = (e) => {
        console.error("Gemini Live WebSocket error:", e);
        setError("Erreur de connexion WebSocket avec le tuteur vocal Gemini.");
        setStatus('error');
        disconnect();
      };

      ws.onclose = () => {
        console.log("WebSocket Gemini Live fermé.");
        if (status === 'connected') {
          disconnect();
        }
      };

    } catch (err: any) {
      console.error('Failed to connect to Gemini Live:', err);
      setError(err.message || 'La connexion a échoué');
      setStatus('error');
      disconnect();
    }
  }, [language, courseContext, onTranscript, disconnect, stopPlayback, status]);

  // Play a chunk of raw 24kHz float32 audio
  const playAudioChunk = (float32Data: Float32Array) => {
    const ctx = playbackCtxRef.current;
    if (!ctx || ctx.state === 'closed') return;

    // Create audio buffer at 24kHz
    const audioBuffer = ctx.createBuffer(1, float32Data.length, 24000);
    audioBuffer.getChannelData(0).set(float32Data);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    // Schedule audio rendering smoothly
    const currentTime = ctx.currentTime;
    const startTime = Math.max(currentTime, nextPlayTimeRef.current);
    
    source.start(startTime);
    activeSourcesRef.current.push(source);

    // Track when this chunk will finish
    const duration = audioBuffer.duration;
    nextPlayTimeRef.current = startTime + duration;

    // Clean up active source when done
    source.onended = () => {
      activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source);
    };
  };

  return {
    status,
    error,
    connect,
    disconnect,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
  };
}
