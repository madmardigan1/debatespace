import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatToNodeService {
  buttonType: string = '';
  private eventEmitter: EventEmitter<any> = new EventEmitter();
    constructor() { }
  
  setButton(buttonType: string) {
  
  this.eventEmitter.emit(buttonType);
  this.buttonType=buttonType;
  }
  
  getUser() : string {
   return this.buttonType;
  }
}
