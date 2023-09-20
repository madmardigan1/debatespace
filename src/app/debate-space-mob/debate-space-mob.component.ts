import { Component, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardDataService, Card } from '../space-service.service';
import { DebateAuthService } from '../home/debate-auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ChatSpaceMobComponent } from './chat-space-mob/chat-space-mob.component';
import { DebateSpaceService } from './debate-space.service';
import { ChatSubmitService } from './chat-submit-mob/chat-submit.service';
import { GPTsummaryService } from './gptsummary-mob/gptsummary.service';
import { Subscription } from 'rxjs';

@Component({
  animations: [
    trigger('expandShrink', [
      state('expanded', style({
        height: '100%',
      })),
      state('shrunk', style({
        height: '40%',
      })),
      state('minimized', style({
        height: '0%',
      })),
      transition('expanded <=> shrunk', [
        animate('0.2s')
      ]),
    ]),
    trigger('expandShrinkrest', [
      state('expanded', style({
        height: '60%',
      })),
      state('shrunk', style({
        height: '0%',
      })),
      state('fully-expanded', style({
        height: '100%',
      })),
      transition('expanded <=> shrunk', [
        animate('0.2s')
      ]),
    ]),
    [
      trigger('slideUpDown', [
        state('hidden', style({
          transform: 'translateY(100%)'
        })),
        state('visible', style({
          transform: 'translateY(0%)'
        })),
        transition('hidden <=> visible', [
          animate('0.3s')
        ])
      ])
    ]
    
  ],
  
  selector: 'app-debate-space-mob',
  templateUrl: './debate-space-mob.component.html',
  styleUrls: ['./debate-space-mob.component.css']
})
export class DebateSpaceMobComponent implements AfterViewChecked {
  @ViewChild(ChatSpaceMobComponent, { static: false }) secondChild!: ChatSpaceMobComponent;
  toggleChats:boolean = false;
  toggleChatsText:string = "Type in chat";
  selectedButton: number = 1;
  private subscription! : Subscription;
  @ViewChild('chatView') private chatContainer!: ElementRef;
    text: string = '';
    card!: Card;
    cards!: any[];
    panelType = "chat";
    receiveType = true;
    receiveType2 = false;
    selectedNode: boolean = false;
    userType: string = 'host';
    isRecording = false;
    nodeState: string = 'shrunk';
    theRestState: string = 'expanded';
    expandShrink=false;
    value = '';
    constructor (private gptSum:GPTsummaryService,private debateSpace: DebateSpaceService ,private route: ActivatedRoute, private cardService: CardDataService, private router: Router, private debateAuth: DebateAuthService, private chatSubmit:ChatSubmitService){
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
      this.scrollToBottom();
    }
  
    toggleChat () {
      this.selectedButton = 1;
      if (this.toggleChats) {
        this.toggleChatsText = "Type in chat";
      }
      else {
        this.toggleChatsText = "Respond to speaker";
      
      }
      this.toggleChats = !this.toggleChats;
    }
    receiveValue(value: boolean) {
      this.receiveType = !this.receiveType;
      if (!value) {
        if (!this.expandShrink) {
          this.nodeState = 'expanded';
          this.theRestState = 'shrunk';
        }
        else {
          this.nodeState = 'shrunk';
          this.theRestState = 'expanded';
        }
        this.expandShrink = !this.expandShrink;
       
      } else {
        
      }
    }

    private scrollToBottom(): void {
      try {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      } catch (err) {
        
      }
    }

    toggleFirstPanel (panelType:string): void {
      this.panelType = panelType;
    }

    selectButton(buttonNumber: number): void {
      this.selectedButton = buttonNumber;
    }

  
    toggle(buttonType: string): void {
      this.debateSpace.Toggle(buttonType);
    }

    changeIcon(recordType : boolean) {
      this.isRecording = !recordType;
    }


    panelState: 'hidden' | 'visible' = 'hidden';
    startY: number | null = null;
  
    togglePanel(togglenumber: number): void {
      this.selectedButton=togglenumber;
      this.panelState = this.panelState === 'hidden' ? 'visible' : 'hidden';
    }
  
    startDrag(event: MouseEvent): void {
      this.startY = event.clientY;
      document.addEventListener('mousemove', this.handleDrag);
      document.addEventListener('mouseup', this.stopDrag);
    }
  
    handleDrag = (event: MouseEvent) => {
      if (this.startY && event.clientY - this.startY > 50) { // Drag down by 50 pixels to close
        this.panelState = 'hidden';
        this.stopDrag();
      }
    }

    fullScreen(value: boolean) {
      this.receiveType2 = !this.receiveType2;
      if (value) {
        if (!this.expandShrink) {
          this.nodeState = 'minimized';
          this.theRestState = 'fullly-expanded';
        }
        else {
          this.nodeState = 'shrunk';
          this.theRestState = 'expanded';
        }
        this.expandShrink = !this.expandShrink;
       
      } else {
        
      }
    }

    stopDrag = () => {
      this.startY = null;
      document.removeEventListener('mousemove', this.handleDrag);
      document.removeEventListener('mouseup', this.stopDrag);
    }

    onSubmitit(event: Event) {
     
      event.preventDefault(); 
     
       if (this.value) {
        this.chatSubmit.sendNodeText(this.value);
        this.value = '';
      }
    }

    sendEmoji(emoji: string): void {
      this.debateSpace.sendEmoji(emoji);
    }

    simulate(type:string):void {
      this.userType=type;
      console.log(this.userType);
    }
  }
  

