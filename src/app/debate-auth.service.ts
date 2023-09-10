import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DebateAuthService {
typeofUser: string = '';
private eventEmitter: EventEmitter<any> = new EventEmitter();
  constructor() { }

setUser(userType: string) {

this.eventEmitter.emit(userType);
this.typeofUser = userType;
}

getUser() : string {
 return this.typeofUser;
}
}
