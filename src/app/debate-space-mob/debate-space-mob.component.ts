import { Component, OnInit, Input, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardDataService, Card } from '../space-service.service';
import { DebateAuthService } from '../debate-auth.service';
import { ChatToNodeService } from '../chat-to-node.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-debate-space-mob',
  templateUrl: './debate-space-mob.component.html',
  styleUrls: ['./debate-space-mob.component.css']
})
export class DebateSpaceMobComponent implements AfterViewChecked {
  selectedButton: number = 1;
  @ViewChild('chatView') private chatContainer!: ElementRef;
    text: string = '';
    card!: Card;
    cards!: any[];
    selectedNode: boolean = false;
    userType: string = '';
    buttonType: string = '';
    buttonTypeSubject = new Subject<string>();
    constructor (private route: ActivatedRoute, private cardService: CardDataService, private router: Router, private debateAuth: DebateAuthService, private chatN:ChatToNodeService ){
      this.userType=this.debateAuth.getUser();
    }
  
    ngAfterViewChecked() {
      this.scrollToBottom();
    }

    ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      this.cardService.cards$.subscribe((cards) => {
        this.cards = cards;  // Populate the cards array
        const card = cards.find((card) => card.id === id);
        if (card !== undefined) { // Check if card is not undefined
          this.card = card;
        } else {
          // Handle case when card is not found, e.g., redirect or show a message
        }
      });
    }
    generateRoute(card: any) {
      return ['/debate', card.id];
    }
    
    updateText(newText: string) {
      this.text = newText;
    }
  
    receiveValue(value: boolean) {
      this.selectedNode = value;
  
    }

    private scrollToBottom(): void {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch (err) {
        console.error("Error auto-scrolling the chat", err);
      }
    }

 

    selectButton(buttonNumber: number): void {
      this.selectedButton = buttonNumber;
    }

    thumbup(): void {
      this.buttonType = "thumbup";
      this.buttonTypeSubject.next(this.buttonType);
    }
    thumbdown(): void {
      this.buttonType = "thumbdown";
      this.buttonTypeSubject.next(this.buttonType);
    }
    toggle(): void {
      this.buttonType= "toggle";
      this.buttonTypeSubject.next(this.buttonType);
    }
  }
  

