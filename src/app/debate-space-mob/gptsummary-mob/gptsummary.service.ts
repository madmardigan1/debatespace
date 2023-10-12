import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GPTsummaryService {
  private value = new BehaviorSubject<boolean>(false);
  constructor() { }

  sendExpansion(value: boolean): void {
    this.value.next(value);
  }

  getExpansion(): Observable<boolean> {
    return this.value.asObservable();
  }
  
}
