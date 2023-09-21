import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopicMenuService {
 
  private topiclist = new BehaviorSubject<string[]>([]); 

  constructor() { }

  addTopics(topic: string[]): void {
 
    this.topiclist.next(topic);
  }

  getTopics(): Observable<string[]> {
    return this.topiclist.asObservable();
  }
}
