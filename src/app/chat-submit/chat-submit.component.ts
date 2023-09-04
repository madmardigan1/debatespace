import { Component, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-chat-submit',
  templateUrl: './chat-submit.component.html',
  styleUrls: ['./chat-submit.component.css']
})
export class ChatSubmitComponent {
  value = '';
  @Output() submitit = new EventEmitter<string>();

  constructor () {
  }
  onSubmitit(event: Event) { // <-- Accept the event argument here
    event.preventDefault(); 
    //console.log('Custom onSubmit called:', this.value[0]);
    if (this.value) {
      this.submitit.emit(this.value);
      this.value = '';
    }
  }
  
  
}
