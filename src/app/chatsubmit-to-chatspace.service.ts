import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatsubmitToChatspaceService {

  private buttonPressedSource = new Subject<void>();
  buttonPressed$ = this.buttonPressedSource.asObservable();

  buttonClicked() {
    this.buttonPressedSource.next();
  }
}
