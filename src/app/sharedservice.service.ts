import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class SharedserviceService {
  private nodeTextSource =  new Subject<{ text: string, id: number}[]>();

  // The exposed observable for components to listen
  changeNodeText$ = this.nodeTextSource.asObservable();

  constructor() { }

  changeNodeText(textArray: { text: string, id: number}[]) {
    this.nodeTextSource.next(textArray);
  }
}