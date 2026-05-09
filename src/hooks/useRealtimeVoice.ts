import { useState, useRef, useCallback } from 'react';

type VoiceStatus = 'idle' | 'connecting' | 'connected' | 'error';

interface UseRealtimeVoiceOptions {
  language: string;
  courseContext: string;
  onTranscript?: (role: 'user' | 'assistant', text: string) => void;
}

export function useRealtimeVoice({ language, courseContext, onTranscript }: UseRealtimeVoiceOptions) {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const connect = useCallback(async () => {
    setStatus('connecting');
    setError(null);

    try {
      // 1. Get ephemeral token from our API
      const tokenRes = await fetch('/api/realtime-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          language: language.substring(0, 2),
          courseContext: courseContext.substring(0, 8000)
        }),
      });

      if (!tokenRes.ok) {
        throw new Error(`Token error: ${tokenRes.status}`);
      }

      const data = await tokenRes.json();
      const ephemeralKey = data.client_secret?.value;

      if (!ephemeralKey) {
        throw new Error('No ephemeral key returned');
      }

      // 2. Create WebRTC peer connection
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // 3. Set up audio output
      const audioEl = document.createElement('audio');
      audioEl.autoplay = true;
      audioRef.current = audioEl;

      pc.ontrack = (e) => {
        audioEl.srcObject = e.streams[0];
      };

      // 4. Add microphone input with echo cancellation to prevent AI interrupting itself
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true, 
          noiseSuppression: true, 
          autoGainControl: true 
        } 
      });
      streamRef.current = stream;
      pc.addTrack(stream.getTracks()[0]);

      // 5. Set up data channel for transcripts
      const dc = pc.createDataChannel('oai-events');
      dcRef.current = dc;

      dc.onmessage = (e) => {
        try {
          const event = JSON.parse(e.data);
          
          // User transcript
          if (event.type === 'conversation.item.input_audio_transcription.completed') {
            onTranscript?.('user', event.transcript || '');
          }
          
          // Assistant transcript (when audio response is done)
          if (event.type === 'response.audio_transcript.done') {
            onTranscript?.('assistant', event.transcript || '');
          }
        } catch (err) {
          // ignore parse errors
        }
      };

      dc.onopen = () => {
        setStatus('connected');
      };

      // 6. Create and send SDP offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const sdpRes = await fetch('https://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp',
        },
        body: offer.sdp,
      });

      if (!sdpRes.ok) {
        throw new Error(`SDP error: ${sdpRes.status}`);
      }

      const answerSdp = await sdpRes.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

    } catch (err: any) {
      console.error('Realtime voice error:', err);
      setError(err.message || 'Connection failed');
      setStatus('error');
      disconnect();
    }
  }, [language, courseContext, onTranscript]);

  const disconnect = useCallback(() => {
    // Stop microphone
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }

    // Close data channel
    if (dcRef.current) {
      dcRef.current.close();
      dcRef.current = null;
    }

    // Close peer connection
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    // Stop audio
    if (audioRef.current) {
      audioRef.current.srcObject = null;
      audioRef.current = null;
    }

    setStatus('idle');
  }, []);

  return {
    status,
    error,
    connect,
    disconnect,
    isConnected: status === 'connected',
    isConnecting: status === 'connecting',
  };
}
