import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NodeshareService } from 'src/app/nodeshare.service';
import { NodeLinkService } from 'src/app/node-link.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import { ChatsubmitToChatspaceService } from 'src/app/chatsubmit-to-chatspace.service';

@Component({
  selector: 'app-chat-space-mob',
  templateUrl: './chat-space-mob.component.html',
  styleUrls: ['./chat-space-mob.component.css']
})
export class ChatSpaceMobComponent implements AfterViewInit, OnChanges {
  scrollChat: Array<{ sender: string, text: string, color: string, id?: number }> = [];

  private nodeSelected: number = 0;
  private isButton: boolean = false;

  sanitizedLinks: Array<SafeUrl> = [];
  private idSubscription: Subscription;
  
  @Input() displayText: string = '';
  private subscription: Subscription;

  constructor(
    private chatToSpace: ChatsubmitToChatspaceService,
    private nodeShare: NodeshareService,
    private nodeLink: NodeLinkService,
    private sanitizer: DomSanitizer
  ) {
    this.idSubscription = this.chatToSpace.id$.subscribe((receivedId) => {
      this.updateChat({
        sender: "Steve",
        text: ' wants you to check out the action at ',
        color: this.getRandomColor(),
        id: receivedId
      });
    });

    this.subscription = this.chatToSpace.message$.subscribe(message => {
      this.updateChat({
        sender: "Steve", // or any logic to determine the sender
        text: `${message.text} [Link here](${message.link})`,
        color: this.getRandomColor(),
        id: message.id
      });
    });
  }

  ngAfterViewInit(): void {
    this.nodeShare.getEvent().subscribe(data => {
      this.nodeSelected = data;
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

  ngOnChanges(changes: SimpleChanges): void { }

  updateChat(message: { sender: string, text: string, color: string, id?: number }): void {
    this.scrollChat.push(message);
  }

  buttonClicked(id: number): void {
    console.log(id);
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.idSubscription.unsubscribe();
  }
}
