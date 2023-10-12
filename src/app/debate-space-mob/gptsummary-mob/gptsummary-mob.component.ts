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
  expandedLineIndices: Set<number> = new Set();
  expandedChildIndices: Set<number> = new Set();

  // State management properties
  isPlaying = false;
  traveled = false;
  isRecordingVideo = false;
  private goBackonemore: any;

  constructor(
    private nodeService: NodespaceServiceService, 
    private chatSpace: ChatspaceService, 
  ) {
   
  }

  ngAfterViewInit(): void {
 
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


  logNodeId(nodeId: number): void {
    this.chatSpace.sendLink(nodeId);
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
  expandLine(line: any, index: number): void {
    line.expand = !line.expand; // Toggle the expansion
    if (this.expandedLineIndices.has(index)) {
      this.expandedLineIndices.delete(index);
    } else {
      this.expandedLineIndices.add(index);
    }
  }

  isLineExpanded(index: number): boolean {
    return this.expandedLineIndices.has(index);
  }

  expandChild(child: any, index: number): void {
    child.expand = !child.expand; // Toggle the expansion
    if (this.expandedChildIndices.has(index)) {
      this.expandedChildIndices.delete(index);
    } else {
      this.expandedChildIndices.add(index);
    }
  }

  isChildExpanded(index: number): boolean {
    return this.expandedChildIndices.has(index);
  }
}
