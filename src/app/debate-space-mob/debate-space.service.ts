import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DebateSpaceService {

  private buttonType = new Subject<string[]>(); 
  private emojiType = new BehaviorSubject<string>(''); 
 
  constructor() { }


  Toggle(level: string, reaction:string, tag:string): void {
    this.buttonType.next([level,reaction, tag]);
  }

  getToggle(): Observable<string[]> {
    return this.buttonType.asObservable();
  }

  sendEmoji(level: string): void {
    this.emojiType.next(level);
  }

  getEmoji(): Observable<string> {
    return this.emojiType.asObservable();
  }


}
