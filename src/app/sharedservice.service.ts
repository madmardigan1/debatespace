import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedserviceService {
  private nodeTextSource = new BehaviorSubject<{ text: string, id: number}[]>([{text:'',id:1}]); // Added initial value as an empty array

  constructor() { }

  changeNodeText(textArray: { text: string, id: number}[]): void {
    this.nodeTextSource.next(textArray);
  }

  getNodeText(): Observable<{ text: string, id: number}[]> {  // Fixed return type to match what nodeTextSource emits
    return this.nodeTextSource.asObservable();
  }
}
