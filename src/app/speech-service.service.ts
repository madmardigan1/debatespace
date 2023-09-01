import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
//import { ChangeDetectorRef } from '@angular/core';

declare var webkitSpeechRecognition: any;
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
  private speechRecognition: any;
  public phrases = new Subject<string>();
  private currentTranscript = '';

  constructor() {
    // Check for SpeechRecognition API availability
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
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

  
  startListening() {
    if (this.recognition) {
      this.recognition.start();
    }
  }

  stopListening() {
    this.transcript = '';
    this.finalTranscript = '';

    if (this.recognition) {
      this.recognition.stop();
    }
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
    });
  }

  stopRecordingAudio() {
    // Stop recording audio
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
    }
  }

  playRecordedAudio() {
    if (this.audioBlob) {
      const audioUrl = URL.createObjectURL(this.audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  }

}

