import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ChatSubmitService {

  private chatInfo = new BehaviorSubject<string>(''); 
  private nodeInfo = new Subject<string[]>(); 
  private linkId = new BehaviorSubject<number>(0);
 
  constructor() { }


  sendChat(text: string): void {
    this.chatInfo.next(text);
  }

 getChat(): Observable<string> {
    return this.chatInfo.asObservable();
  }
  
  sendLinkId(Id: number): void {
    this.linkId.next(Id);
  }

 getLinkId(): Observable<number> {
    return this.linkId.asObservable();
  }
  sendNodeText(text: string, reaction:string, tag: string): void {
    this.nodeInfo.next([text, reaction, tag]);
    
    
  }

 getNodeText(): Observable<string[]> {
    return this.nodeInfo.asObservable();
    
  }
}
