import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodespaceServiceService } from '../node-space-mob/nodespace-service.service';
import { ChatspaceService } from '../chat-space-mob/chatspace.service';

@Component({
  selector: 'app-gptsummary-mob',
  templateUrl: './gptsummary-mob.component.html',
  styleUrls: ['./gptsummary-mob.component.css']
})
export class GptsummaryMobComponent implements OnDestroy, AfterViewInit {
  
  public lines: { text: string, id: number }[] = [];
  private subscription!: Subscription;
  private subscription1!: Subscription;
  private subscription2!: Subscription;
   nextNode: any;
   previousNode: any;
   goBackone: any;
  private goBackonemore: any;
  traveled=false;

  constructor(private nodeService: NodespaceServiceService, private chatSpace:ChatspaceService) {
  
  this.subscription1 = this.nodeService.getSiblingData().subscribe((message: { previous: string, next: string }|null) => {
      if (message) {
        this.previousNode = message.previous;
        this.nextNode = message.next;
      } else {
        // Handle the case when message is null
        this.previousNode = null;
        this.nextNode = null;
      }
    });
    
    this.subscription2 =this.nodeService.getNodeId().subscribe((message: number | undefined) => {
      this.goBackone=message;
    });

    
    

  }

  ngAfterViewInit(): void {
    this.subscription = this.nodeService.getNodeText().subscribe((messages: { text: string, id: number }[]) => {
      this.lines = messages;
  });
  }
  goBack () {

    this.chatSpace.sendLink(this.goBackonemore);
    this.traveled=false;
  }

  previousId ()  {
    
    if (this.previousNode) {
 
      this.goBackone=this.previousNode;
      this.chatSpace.sendLink(this.previousNode);
    }
  
  }
  nextId () {
    if (this.nextNode) {
      this.goBackone=this.nextNode;
      this.chatSpace.sendLink(this.nextNode);
    }
  }
  logNodeId(nodeId: number) {
    this.goBackonemore=this.goBackone;
    this.traveled=true;
    this.chatSpace.sendLink(nodeId);
    this.goBackone=nodeId;
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
