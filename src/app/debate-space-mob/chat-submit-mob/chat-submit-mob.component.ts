import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ChatsubmitToChatspaceService } from 'src/app/chatsubmit-to-chatspace.service';

import { ChatsubmitToNodeService } from 'src/app/chatsubmit-to-node.service';
@Component({
  selector: 'app-chat-submit-mob',
  templateUrl: './chat-submit-mob.component.html',
  styleUrls: ['./chat-submit-mob.component.css']
})
export class ChatSubmitMobComponent {
    
    value = '';
    @Output() submitit = new EventEmitter<string>();
  @Input() toggleChatsText:string = '';
    constructor (private chattoSpace:ChatsubmitToChatspaceService , private chattoNode: ChatsubmitToNodeService) {
    }

    onSubmitit(event: Event) {
      event.preventDefault(); 
      if (this.value && this.toggleChatsText == "Type in chat") {
        this.submitit.emit(this.value);
        this.value = '';
      }
      if (this.value && this.toggleChatsText == "Respond to speaker") {
        this.chattoNode.setButton(this.value);
        this.value = '';
      }
    }

    // This function gets triggered when the link icon is clicked.
    LinkNode() {
      this.chattoSpace.buttonClicked();
       
    }
}
