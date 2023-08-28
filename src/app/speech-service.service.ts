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
    /*this.currentTranscript = '';
    this.speechRecognition = new webkitSpeechRecognition();
    this.speechRecognition.continuous = true;
    this.speechRecognition.interimResults = true;
    this.speechRecognition.onresult = this.onResult.bind(this);
    this.speechRecognition.start();*/
  }

  stopListening() {
    this.transcript = '';
    this.finalTranscript = '';

    if (this.recognition) {
      this.recognition.stop();
    }
    /*
    if (this.speechRecognition) {
      this.speechRecognition.stop();
      this.phrases.next(this.currentTranscript);
      this.currentTranscript = '';
      this.speechRecognition = null;
    }*/
  }

 /* private onResult(event: any) {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      this.currentTranscript += transcript;
      this.phrases.next(this.currentTranscript);
    }
  }*/
}

