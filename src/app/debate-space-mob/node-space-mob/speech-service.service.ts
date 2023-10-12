import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  transcript = '';
  private finalTranscript = '';
  mediaRecorder: any;
  mediaChunks: any[] = [];
  mediaBlob: Blob | null = null;
  private recognition: any;
  public phrases = new Subject<string>();
  private currentTranscript = '';
  private stream: MediaStream | null = null;



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

  //begins listening and saves the transcript to this.transcript.  This triggers a next event in the phrases observable
  startListening() {
    if (!this.recognition) {
      console.warn("Speech recognition is not available.");
      return;
    }
    this.transcript = '';
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

  //this function is called when the user clicks the record button.  It starts recording audio and/or video and saves it to this.mediaBlob
  startRecording(includeVideo: boolean = false) {
    // Define media constraints
    const constraints = {
      audio: {
        echoCancellation: true
      },
      video: includeVideo
    };
    navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      this.mediaRecorder = new MediaRecorder(stream);

      // Common chunks array for both audio and video
      this.mediaChunks = [];

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        this.mediaChunks.push(event.data);
      };

      this.mediaRecorder.onstop = () => {
        const mediaType = includeVideo ? 'video/webm' : 'audio/wav';
        this.mediaBlob = new Blob(this.mediaChunks, { type: mediaType });
        // Now, you can use this.mediaBlob to play the audio/video, or save it somewhere
      };

      this.mediaRecorder.start();
    }).catch(error => {
      console.warn("Error accessing media:", error);
    });
  }

  //returns the audio or video blob that was recorded.
  stopAndReturnMedia(): Promise<{ blob: Blob, type: 'audio' | 'video' } | null> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        console.warn("Media recorder is not initialized.");
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mediaType = this.mediaRecorder.mimeType.startsWith('video/') ? 'video' : 'audio';
        this.mediaBlob = new Blob(this.mediaChunks, { type: this.mediaRecorder.mimeType });

        resolve({ blob: this.mediaBlob, type: mediaType });
      };

      this.mediaRecorder.onerror = (e: Event) => {
        reject(e);
      };

      this.mediaRecorder.stop();
    });
  }

  //gets and binds the live video feed to an element while the user is recording
  getStream(constraints: MediaStreamConstraints): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia(constraints).then(s => {
      this.stream = s;
      return s;
    });
  }

  bindStreamToVideoElement(videoElement: HTMLVideoElement): void {
    if (this.stream) {
      videoElement.srcObject = this.stream;
      videoElement.muted = true;
      videoElement.play();
    }
  }

}

