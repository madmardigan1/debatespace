import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatsubmitToNodeService {
  private buttonType: BehaviorSubject<string> = new BehaviorSubject<string>('');
    constructor() { }
  
    setButton(buttonType: string): void {
      this.buttonType.next(buttonType);
    }
  
    getResponse(): Observable<string> {
      return this.buttonType.asObservable();
    }
}
