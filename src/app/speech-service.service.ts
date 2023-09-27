import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  transcript = '';
  private finalTranscript = '';
  mediaRecorder: any;
  audioChunks: any[] = [];
  audioBlob: Blob | null = null;
  private recognition: any;
 
  public phrases = new Subject<string>();
  private currentTranscript = '';

  constructor() {
    // Check for SpeechRecognition API availability
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
   


      
    }
   else {
    console.warn("Speech Recognition is not available in this browser.");
  }
  }

  
  startListening() {
    if (!this.recognition) {
      console.warn("Speech recognition is not available.");
      return;
    }
    this.transcript='';
    this.finalTranscript = '';
    if (this.recognition) {
      this.recognition.start();
      this.recognition.onresult = (event: any) => {
        let interim_transcript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                this.finalTranscript += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }

        this.transcript = this.finalTranscript + interim_transcript;
        this.phrases.next(this.transcript);
        // Manually trigger change detection
       
    };
    }
  }

  stopListening() {
    if (!this.recognition) {
      console.warn("Speech recognition is not available.");
      return;
    }
    this.transcript = '';
    this.finalTranscript = '';

    if (this.recognition) {
      this.recognition.stop();
    }
  }


  clearRecordingAudio() {
    this.audioBlob = null;
  }

  startRecordingAudio() {
    // Start recording audio

    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event: BlobEvent)=> {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        // Now, you can use this audioBlob to play the audio, or save it somewhere
      };

      this.mediaRecorder.start();
    }).catch(error => {
      console.warn("Error accessing microphone:", error);
    });
  }

  stopAndReturnAudio(): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        console.warn("Media recorder is not initialized.");
        resolve(null);
        return;
      }
  
      this.mediaRecorder.onstop = () => {
        this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        resolve(this.audioBlob);
      };
  
      this.mediaRecorder.onerror = (e: Event) => {
        reject(e);
      };
      
  
      this.mediaRecorder.stop();
    });
  }
  
/*
  stopRecordingAudio() {
    // Stop recording audio
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }*/
/*
  returnAudio(): Blob | null {
    return this.audioBlob;
  }*/
  
  playRecordedAudio() {
    if (this.audioBlob) {
      const audioUrl = URL.createObjectURL(this.audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  }


  //combine audio blobs.  future plan to allow a replay of a branch
  async concatenateAudioBlobs(blobs: Blob[]): Promise<Blob> {
    const AudioContextConstructor = window.AudioContext || (window as any).webkitAudioContext;
    const audioContext = new AudioContextConstructor();

    // Decode each blob into an audio buffer
    const audioBuffers = await Promise.all(
      blobs.map(async blob => {
        const arrayBuffer = await blob.arrayBuffer();  // Use await here to resolve the promise
        return audioContext.decodeAudioData(arrayBuffer);
      })
    );
  
    // Compute the total length for the new audio buffer
    let totalLength = 0;
    for (const buffer of audioBuffers) {
      totalLength += buffer.length;
    }
  
    // Create a new buffer of the total length
    const concatenatedBuffer = audioContext.createBuffer(
      audioBuffers[0].numberOfChannels,
      totalLength,
      audioBuffers[0].sampleRate
    );
  
    // Copy the samples from the individual buffers to the concatenated buffer
    for (let channel = 0; channel < audioBuffers[0].numberOfChannels; channel++) {
      let position = 0;
      for (const buffer of audioBuffers) {
        concatenatedBuffer.copyToChannel(buffer.getChannelData(channel), channel, position);
        position += buffer.length;
      }
    }
  
    // Convert the audio buffer back to a blob
    return this.bufferToBlob(concatenatedBuffer);
  }
  
  async bufferToBlob(buffer: AudioBuffer): Promise<Blob> {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    const mediaStreamDestination = audioContext.createMediaStreamDestination(); // Create a MediaStreamAudioDestinationNode
    const recorder = new MediaRecorder(mediaStreamDestination.stream); // Use the stream property from MediaStreamAudioDestinationNode
    const chunks: Blob[] = [];

    return new Promise<Blob>((resolve, reject) => {
        recorder.ondataavailable = e => chunks.push(e.data);
        recorder.onstop = () => resolve(new Blob(chunks, { type: 'audio/wav' }));
        recorder.onerror = reject;

        source.connect(mediaStreamDestination); // Connect source to mediaStreamDestination
        source.start(0);
        recorder.start();

        source.onended = () => {
            recorder.stop();
            audioContext.close();
        };
    });
}

  
}

