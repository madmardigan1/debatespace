import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chat-submit',
  templateUrl: './chat-submit.component.html',
  styleUrls: ['./chat-submit.component.css']
})
export class ChatSubmitComponent {
  value = '';
  @Output() submit = new EventEmitter<string>();

  onSubmit() {
    if (this.value) {
      this.submit.emit(this.value);
      this.value = '';
    }
  }
}
