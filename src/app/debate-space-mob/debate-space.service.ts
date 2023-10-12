import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DebateSpaceService {

  private buttonType = new Subject<any[]>(); 
  private emojiType = new BehaviorSubject<string>(''); 
 
  constructor() { }

//toggle and getToggle send and receive the entered text, reaction type, and tag when the user clicks the reaction button
  Toggle(level: string, soundClip:any, videoClip:any, reaction:string, tag:string): void {
    this.buttonType.next([level,soundClip,videoClip,reaction, tag]);
   
  } 

  getToggle(): Observable<any[]> {
    return this.buttonType.asObservable();
  }

}
