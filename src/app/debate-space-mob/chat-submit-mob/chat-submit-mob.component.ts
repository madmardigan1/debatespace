import { Component, Output, EventEmitter, Input } from '@angular/core';
import { NodespaceServiceService } from '../node-space-mob/nodespace-service.service';
import { ChatSubmitService } from './chat-submit.service';

@Component({
  selector: 'app-chat-submit-mob',
  templateUrl: './chat-submit-mob.component.html',
  styleUrls: ['./chat-submit-mob.component.css']
})
export class ChatSubmitMobComponent {
    private nodeSelected: number | undefined;
    value = '';
    @Output() submitit = new EventEmitter<string>();
  @Input() toggleChatsText:string = '';
    constructor (private nodeService: NodespaceServiceService, private chatSubmit: ChatSubmitService) {
      
      this.nodeService.getNodeId().subscribe(data => {
        this.nodeSelected=data;
      });
   
    }

    onSubmitit(event: Event) {
     
      event.preventDefault(); 
      if (this.value && this.toggleChatsText == "Type in chat") {
          this.chatSubmit.sendChat(this.value);
          this.value = '';
      }
    
    }

    // This function gets triggered when the link icon is clicked.
    LinkNode() {
      if (this.nodeSelected){
      this.chatSubmit.sendLinkId(this.nodeSelected);
    
      }
    }
    
}
