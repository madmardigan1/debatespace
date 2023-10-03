import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ChatSubmitService {

  private chatInfo = new BehaviorSubject<string>(''); 
  private nodeInfo = new BehaviorSubject<string[]>(['','']); 
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
  sendNodeText(text: string, reaction:string): void {
    this.nodeInfo.next([text, reaction]);
    
  }

 getNodeText(): Observable<string[]> {
    return this.nodeInfo.asObservable();
    
  }
}
