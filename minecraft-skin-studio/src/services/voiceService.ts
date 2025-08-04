// Voice service for text-to-speech functionality
// Supports both 11Labs API (when available) and Web Speech API fallback

interface VoiceServiceConfig {
  use11Labs: boolean;
  apiKey?: string;
  voiceId?: string;
}

class VoiceService {
  private config: VoiceServiceConfig;
  private audioCache: Map<string, HTMLAudioElement>;
  private isInitialized: boolean = false;

  constructor() {
    this.config = {
      use11Labs: false, // Default to Web Speech API
      voiceId: 'EXAVITQu4vr4xnSDxMaL' // Default 11Labs voice (Bella)
    };
    this.audioCache = new Map();
  }

  async initialize(): Promise<void> {
    // Try to load 11Labs API key from environment
    try {
      // Check if 11Labs API key is available
      const apiKey = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
      if (apiKey) {
        this.config.use11Labs = true;
        this.config.apiKey = apiKey;
        console.log('🎤 11Labs API initialized');
      } else {
        console.log('🎤 Using Web Speech API (11Labs key not found)');
      }
    } catch (error) {
      console.warn('🎤 Failed to initialize 11Labs, using Web Speech API', error);
    }
    this.isInitialized = true;
  }

  async speak(text: string, options?: { rate?: number; pitch?: number; volume?: number }): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Check cache first
    const cacheKey = `${text}_${JSON.stringify(options)}`;
    if (this.audioCache.has(cacheKey)) {
      const cachedAudio = this.audioCache.get(cacheKey)!;
      cachedAudio.currentTime = 0;
      await cachedAudio.play();
      return;
    }

    if (this.config.use11Labs && this.config.apiKey) {
      await this.speak11Labs(text, cacheKey);
    } else {
      await this.speakWebSpeech(text, options);
    }
  }

  private async speak11Labs(text: string, cacheKey: string): Promise<void> {
    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${this.config.voiceId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': this.config.apiKey!,
          },
          body: JSON.stringify({
            text,
            model_id: 'eleven_monolingual_v1',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`11Labs API error: ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      // Cache the audio element
      this.audioCache.set(cacheKey, audio);
      
      await audio.play();
    } catch (error) {
      console.error('11Labs TTS failed, falling back to Web Speech', error);
      await this.speakWebSpeech(text);
    }
  }

  private async speakWebSpeech(
    text: string, 
    options?: { rate?: number; pitch?: number; volume?: number }
  ): Promise<void> {
    return new Promise((resolve) => {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options?.rate || 0.9;
      utterance.pitch = options?.pitch || 1.0;
      utterance.volume = options?.volume || 0.8;
      
      // Use a child-friendly voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoices = voices.filter(voice => 
        voice.name.includes('Google US English') ||
        voice.name.includes('Microsoft Zira') ||
        voice.name.includes('Samantha')
      );
      
      if (preferredVoices.length > 0) {
        utterance.voice = preferredVoices[0];
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }

  // Preload audio for better performance
  async preloadPhrases(phrases: string[]): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Preload in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < phrases.length; i += batchSize) {
      const batch = phrases.slice(i, i + batchSize);
      await Promise.all(
        batch.map(phrase => 
          this.speak(phrase, { volume: 0 }).catch(() => {
            // Silently fail preloading
          })
        )
      );
    }
  }

  clearCache(): void {
    this.audioCache.forEach(audio => {
      audio.pause();
      if (audio.src.startsWith('blob:')) {
        URL.revokeObjectURL(audio.src);
      }
    });
    this.audioCache.clear();
  }
}

// Export singleton instance
export const voiceService = new VoiceService();