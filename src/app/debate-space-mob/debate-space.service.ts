import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DebateSpaceService {

  private buttonType = new BehaviorSubject<string>(''); 
 
  constructor() { }


  Toggle(level: string): void {
    this.buttonType.next(level);
  }

  getToggle(): Observable<string> {
    return this.buttonType.asObservable();
  }
}
