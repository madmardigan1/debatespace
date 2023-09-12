import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NodeshareService } from 'src/app/nodeshare.service';
import { NodeLinkService } from 'src/app/node-link.service';

@Component({
  selector: 'app-chat-space-mob',
  templateUrl: './chat-space-mob.component.html',
  styleUrls: ['./chat-space-mob.component.css']
})
export class ChatSpaceMobComponent implements AfterViewInit, OnChanges  {

 
    scrollChat: Array<{ text: string, id?: number }> = [];
  
  @Input() displayText: string = '';
  
  constructor (private nodeShare: NodeshareService, private nodeLink: NodeLinkService) {};
  
  
  ngAfterViewInit(): void {
    
    this.nodeShare.getEvent().subscribe(data => {
      this.updateChat("Steve: Come check out this node!", true, data);
    });
    
    
    let counter = 0;
    const intervalId = setInterval(() => {
      this.updateChat("chat update") ;
      counter++;
      if (counter >= 40) {
        clearInterval(intervalId);
      }
    }, 10000);
  }
  
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['displayText']) {
      
      const change = changes['displayText'];
     
      if (change.previousValue !== change.currentValue) {
        this.updateChat(change.currentValue);
      }
    }
  }
  
  
  updateChat(text: string, isButton: boolean = false, id?: number, ): void {
    if (isButton) {
      this.scrollChat.push({ text, id });
    } else {
      this.scrollChat.push({ text });
    }
  }
  
  buttonClicked(id: number): void {
    this.nodeLink.goToNode(id.toString());
  }
  
  
  }
  
  
