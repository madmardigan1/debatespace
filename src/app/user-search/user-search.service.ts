import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSearchService {
  private users: string[] = ['John Doe', 'Jane Smith', 'Alice', 'Bob', 'Steve', 'Jared', 'Molly'];  // Add as many names as you want
 
  private invites = new BehaviorSubject<string>(''); 
  constructor() { }

  search(query: string): string[] {
    return this.users.filter(user => user.toLowerCase().includes(query.toLowerCase()));
  }

  sendInvite(message:string, users: string[]) {
    this.invites.next(message);
  }
  listentoInvite() : Observable<string> {
    return this.invites.asObservable();
  }
}





