import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SharedserviceService {
  private nodeTextSource = new BehaviorSubject<string>('Click on a node to see the chat summary for this node path.');
  currentText = this.nodeTextSource.asObservable();

  constructor() { }

  changeNodeText(text: string) {
    this.nodeTextSource.next(text);
  }
}
