import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var webkitSpeechRecognition: any;
@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private speechRecognition: any;
  public phrases = new Subject<string>();
  private currentTranscript = '';

  constructor() { }

  startListening() {
    this.currentTranscript = '';
    this.speechRecognition = new webkitSpeechRecognition();
    this.speechRecognition.continuous = true;
    this.speechRecognition.interimResults = true;
    this.speechRecognition.onresult = this.onResult.bind(this);
    this.speechRecognition.start();
  }

  stopListening() {
    if (this.speechRecognition) {
      this.speechRecognition.stop();
      this.phrases.next(this.currentTranscript);
      this.currentTranscript = '';
      this.speechRecognition = null;
    }
  }

  private onResult(event: any) {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      this.currentTranscript += transcript;
      this.phrases.next(this.currentTranscript);
    }
  }
}
