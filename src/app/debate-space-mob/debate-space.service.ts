import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DebateSpaceService {

  private buttonType = new BehaviorSubject<string[]>(['','']); 
  private emojiType = new BehaviorSubject<string>(''); 
 
  constructor() { }


  Toggle(level: string, reaction:string): void {
    this.buttonType.next([level,reaction]);
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
