import { Component, OnDestroy, AfterViewInit, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { NodespaceServiceService } from '../node-space-mob/nodespace-service.service';
import { ChatspaceService } from '../chat-space-mob/chatspace.service';

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
  @ViewChildren('textContent') textContents!: QueryList<ElementRef>;

  expandedLineIndices: Set<number> = new Set();
  expandedChildIndices: Set<number> = new Set();

  // State management properties
  isPlaying = false;
  traveled = false;
  isRecordingVideo = false;

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
    const elements = this.textContents.toArray();
    // Collapse all other lines
    for (let i = 0; i < elements.length; i++) {
        if (i !== index) {
            elements[i].nativeElement.style.height = '40px';
            this.expandedLineIndices.delete(i);
        }
    }
    
    if (elements[index]) {
        if (elements[index].nativeElement.style.height === 'auto') {
            elements[index].nativeElement.style.height = '40px';
        } else {
            elements[index].nativeElement.style.height = 'auto';
        }
    }

    // Handle expanded indices for icon rotation
    if (this.expandedLineIndices.has(index)) {
        this.expandedLineIndices.delete(index);
    } else {
        this.expandedLineIndices.add(index);
    }
}

expandChild(child: any, index: number): void {
    // Collapse all other children
    this.children.forEach((c, i) => {
        if (i !== index) {
            c.expand = false;
            this.expandedChildIndices.delete(i);
        }
    });

    child.expand = !child.expand;

    if (this.expandedChildIndices.has(index)) {
        this.expandedChildIndices.delete(index);
    } else {
        this.expandedChildIndices.add(index);
    }
}



  isLineExpanded(index: number): boolean {
    return this.expandedLineIndices.has(index);
  }

  isChildExpanded(index: number): boolean {
    return this.expandedChildIndices.has(index);
  }

  isLineOverflowing(index: number): boolean {
    const elements = this.textContents.toArray();
    if (elements[index]) {
      return elements[index].nativeElement.scrollHeight > elements[index].nativeElement.clientHeight;
    }
    return false;
  }
  
  
}
