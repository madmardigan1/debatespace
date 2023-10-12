import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodespaceServiceService } from '../node-space-mob/nodespace-service.service';
import { ChatspaceService } from '../chat-space-mob/chatspace.service';
import { SpeechService } from 'src/app/debate-space-mob/node-space-mob/speech-service.service';
import { GPTsummaryService } from './gptsummary.service';

@Component({
  selector: 'app-gptsummary-mob',
  templateUrl: './gptsummary-mob.component.html',
  styleUrls: ['./gptsummary-mob.component.css']
})
export class GptsummaryMobComponent implements OnDestroy, AfterViewInit {
  public lines: { text: string, fullText: string, id: number, videoClip?: any, soundClip?: any, expand?: boolean }[] = [];
  public children: { text: string, fullText: string, id: number, videoClip?: any, soundClip?: any, expand?: boolean }[] = [];
  private subscriptions: Subscription[] = [];
  @ViewChild('playbackVideoElement', { static: false }) playbackVideoElement!: ElementRef;
  expandedLines: Set<number> = new Set();

  // State management properties
  isPlaying = false;
  traveled = false;
  isRecordingVideo = false;
  nextNode: any;
  previousNode: any;
  goBackone: any;
  private goBackonemore: any;

  constructor(
    private nodeService: NodespaceServiceService, 
    private chatSpace: ChatspaceService, 
  ) {
   
  }

  ngAfterViewInit(): void {
     // Handle sibling data
     this.subscriptions.push(
      this.nodeService.getSiblingData().subscribe(message => {
        [this.previousNode, this.nextNode] = message ? [message.previous, message.next] : [null, null];
      })
    );

    // Handle node ID
    this.subscriptions.push(
      this.nodeService.getNodeId().subscribe(message => {
        this.goBackone = message;
      })
    );
    this.subscriptions.push(
      this.nodeService.getNodeText().subscribe(messages => {
        this.lines = messages;
      
      })
    );
    this.subscriptions.push(
      this.nodeService.getAllChildren().subscribe(messages => {
        this.children = messages;
  
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // Navigation methods
  goBack(): void {
    this.chatSpace.sendLink(this.goBackonemore);
    this.traveled = false;
  }

  previousId(): void {
    if (this.previousNode) {
      this.goBackone = this.previousNode;
      this.chatSpace.sendLink(this.previousNode);
    }
  }

  nextId(): void {
    if (this.nextNode) {
      this.goBackone = this.nextNode;
      this.chatSpace.sendLink(this.nextNode);
    }
  }

  logNodeId(nodeId: number): void {
    this.goBackonemore = this.goBackone;
    this.traveled = true;
    this.chatSpace.sendLink(nodeId);
    this.goBackone = nodeId;
  }

  // Audio & Video playback methods
  playRecording(nodeId: any): void {
    if (nodeId) {
      const audioUrl = URL.createObjectURL(nodeId);
      new Audio(audioUrl).play();
    }
  }

  playRecordedVideo(data: any): void {
    if (data) {
      this.isPlaying = true;
      const mediaBlobURL = URL.createObjectURL(data);
      setTimeout(() => {
        this.playbackVideoElement.nativeElement.src = mediaBlobURL;
      }, 1000);
    }
  }

  onVideoLoaded(): void {
    this.playbackVideoElement.nativeElement.play();
  }

  closeVideo(event: Event): void {
    event.stopPropagation();
    this.isPlaying = false;
  }

  onPlaybackEnded(): void {
    // allow user to close manually
  }

  // Utility methods for UI
  expand(line: any, index: number): void {
    line.expand = true;
    if (this.expandedLines.has(index)) {
      this.expandedLines.delete(index);
    } else {
      this.expandedLines.add(index);
    }
  }

  isExpanded(index: number): boolean {
    return this.expandedLines.has(index);
  }
}
