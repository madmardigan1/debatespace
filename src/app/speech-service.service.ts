import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

declare var webkitSpeechRecognition: any;

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private speechRecognition: any;
  public phrases = new Subject<string>();

  constructor() { }

  startListening() {
    this.speechRecognition = new webkitSpeechRecognition();
    this.speechRecognition.continuous = true;
    this.speechRecognition.interimResults = true;
    this.speechRecognition.onresult = this.onResult.bind(this);
    this.speechRecognition.start();
  }

  stopListening() {
    if (this.speechRecognition) {
      this.speechRecognition.stop();
      this.speechRecognition = null;
    }
  }

  private onResult(event: any) {
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      this.phrases.next(transcript);
    }
  }
}
