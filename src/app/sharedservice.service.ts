import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedserviceService {
  private nodeTextSource = new BehaviorSubject<string>('default message');
  currentText = this.nodeTextSource.asObservable();

  constructor() { }

  changeNodeText(text: string) {
    this.nodeTextSource.next(text);
  }
}
