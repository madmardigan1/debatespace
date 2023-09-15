import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatsubmitToChatspaceService {
  private _messageSource = new Subject<{ text?: string, link?: string, id?: number }>();
  private _idSource = new Subject<number>();
  
  message$ = this._messageSource.asObservable();
  id$ = this._idSource.asObservable();

  sendMessage(message: { text?: string, link?: string, id?: number }) {
      this._messageSource.next(message);
  }

  sendId(id: number) {
      this._idSource.next(id);
  }
}

