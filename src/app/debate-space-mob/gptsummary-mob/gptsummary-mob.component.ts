import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodespaceServiceService } from '../node-space-mob/nodespace-service.service';
import { ChatspaceService } from '../chat-space-mob/chatspace.service';
import { SpeechService } from 'src/app/speech-service.service';
import { GPTsummaryService } from './gptsummary.service';
@Component({
  selector: 'app-gptsummary-mob',
  templateUrl: './gptsummary-mob.component.html',
  styleUrls: ['./gptsummary-mob.component.css']
})
export class GptsummaryMobComponent implements OnDestroy, AfterViewInit {
  
  public lines: { text: string, fullText: string, id: number, soundClip?: any, expand?: boolean }[] = [];
  private subscription!: Subscription;
  private subscription1!: Subscription;
  private subscription2!: Subscription;
   nextNode: any;
   previousNode: any;
   goBackone: any;
  private goBackonemore: any;
  traveled=false;

  constructor(private gptSum: GPTsummaryService,private nodeService: NodespaceServiceService, private chatSpace:ChatspaceService, private speechService: SpeechService) {
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
    this.subscription = this.nodeService.getNodeText().subscribe((messages: { text: string, fullText: string, id: number, soundClip?: any }[]) => {
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

  playRecording(nodeId: any) : void {
    if (nodeId) {
    const audioUrl = URL.createObjectURL(nodeId);
    const audio = new Audio(audioUrl);
    audio.play();
  }
  }


  expand(line: any): void {
  line.expand = true;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
