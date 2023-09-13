import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chat-submit-mob',
  templateUrl: './chat-submit-mob.component.html',
  styleUrls: ['./chat-submit-mob.component.css']
})
export class ChatSubmitMobComponent {

    value = '';
    @Output() submitit = new EventEmitter<string>();
  
    constructor () {
    }

    onSubmitit(event: Event) {
      event.preventDefault(); 
      if (this.value) {
        this.submitit.emit(this.value);
        this.value = '';
      }
    }

    // This function gets triggered when the link icon is clicked.
    LinkNode() {
       
    }
}
