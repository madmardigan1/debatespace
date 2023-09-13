import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NodeshareService } from 'src/app/nodeshare.service';
import { NodeLinkService } from 'src/app/node-link.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-chat-space-mob',
  templateUrl: './chat-space-mob.component.html',
  styleUrls: ['./chat-space-mob.component.css']
})
export class ChatSpaceMobComponent implements AfterViewInit, OnChanges  {

  scrollChat: Array<{ sender: string, text: string, color: string | undefined, id?: number }> = [];




  
  @Input() displayText: string = '';
  
  constructor (private nodeShare: NodeshareService, private nodeLink: NodeLinkService, private sanitizer: DomSanitizer) {};
  
  
  ngAfterViewInit(): void {
    
    this.nodeShare.getEvent().subscribe(data => {
      this.updateChat({
        sender: 'Steve',
        text: 'Come check out this node!',
        color: this.getRandomColor()
      }, true, data);
    });
    
    
    let counter = 0;

    const intervalId = setInterval(() => {
      const randomMessage = this.getRandomMessage();
      this.updateChat(randomMessage);
      counter++;
      if (counter >= 40) {
        clearInterval(intervalId);
      }
    }, 10000);
    
    

  }
  
  
  ngOnChanges(changes: SimpleChanges): void {
   
  }
  
  updateChat(message: { sender: string, text: string, color?: string }, isButton: boolean = false, id?: number): void {
    if (isButton) {
      this.scrollChat.push({ sender: 'Steve', text: message.text, color: this.getRandomColor(), id });
    } else {
      this.scrollChat.push({ sender: 'Steve', text: message.text, color: this.getRandomColor() });
    }
  }
  
  
  
  buttonClicked(id: number): void {
    this.nodeLink.goToNode(id.toString());
  }
  
 getRandomMessage() {
    const senders = ['Steve', 'Jared'];
    const randomSender = senders[Math.floor(Math.random() * senders.length)];
  
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomText = '';
    for (let i = 0; i < 40; i++) {
      randomText += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  
    return {
      sender: randomSender,
      text: randomText,
      color: this.getRandomColor()
    };
  }
  
  
  
 getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  
  
  }
  
  
