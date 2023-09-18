import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatspaceService {
  private nodeLink = new BehaviorSubject<number>(1); 
 
  constructor() { }


  sendLink(level: number): void {
    this.nodeLink.next(level);
  }

 getLink(): Observable<number> {
    return this.nodeLink.asObservable();
  }
}
