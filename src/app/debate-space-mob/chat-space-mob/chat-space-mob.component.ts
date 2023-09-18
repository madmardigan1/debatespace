  import { Component, Input } from '@angular/core';
  import { SafeUrl } from '@angular/platform-browser';
  import { Subscription } from 'rxjs';
  import { ChatspaceService } from './chatspace.service';
  import { ChatSubmitService } from '../chat-submit-mob/chat-submit.service';

  @Component({
    selector: 'app-chat-space-mob',
    templateUrl: './chat-space-mob.component.html',
    styleUrls: ['./chat-space-mob.component.css']
  })
  export class ChatSpaceMobComponent {
    scrollChat: Array<{ sender: string, text: string, color: string, id?: number }> = [];
    private idSubscription: Subscription; 
    @Input() displayText: string = '';
    private subscription: Subscription;

    constructor(
      private chatSpace: ChatspaceService,
      private chatSubmit: ChatSubmitService
    ) {
      this.idSubscription = this.chatSubmit.getLinkId().subscribe(receivedId => {
        if (receivedId !==0){
        this.updateChat({
          sender: "Steve",
          text: ' wants you to check out the action at ',
          color: this.getRandomColor(),
          id: receivedId
        });
      }
      });

      this.subscription = this.chatSubmit.getChat().subscribe(message => {
        if (message !== '') {
        this.updateChat({
          sender: "Steve", // or any logic to determine the sender
          text: message,
          color: this.getRandomColor(),
        });
      }
      });
    }

/*
    let counter = 0;
    const intervalId = setInterval(() => {
      const randomMessage = this.getRandomMessage();
      this.updateChat(randomMessage);
      counter++;
      if (counter >= 40) {
        clearInterval(intervalId);
      }
    }, 10000);*/
  

  updateChat(message: { sender: string, text: string, color: string, id?: number }): void {
    this.scrollChat.push(message);
  }

  buttonClicked(id: number): void {
    this.chatSpace.sendLink(id);
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
