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
    onSubmitit(event: Event) { // <-- Accept the event argument here
      event.preventDefault(); 
      //console.log('Custom onSubmit called:', this.value[0]);
      if (this.value) {
        this.submitit.emit(this.value);
        this.value = '';
      }
    }
    
    
  }
  
