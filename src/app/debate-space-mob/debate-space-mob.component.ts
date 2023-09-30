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
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceTypeService } from '../device-type.service';

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
  selectedButton: number = -1;
  private subscription! : Subscription;
  @ViewChild('chatView') private chatContainer!: ElementRef;

  //game rules
  private intervalId: any;
  debateFeatures=false;
  isRanked = true;
 



  //other variables
    firstDarkenPane = false;
    secondDarkenPane = false;
    text: string = '';
    card!: Card;
    cards!: any[];
    blurState = 0;
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
    deviceType=false;
    getLink:string = '';
    isSecondModalOpen = false;
    constructor (private snackBar: MatSnackBar,private gptSum:GPTsummaryService,private debateSpace: DebateSpaceService ,private route: ActivatedRoute, private cardService: CardDataService, private router: Router, private debateAuth: DebateAuthService, private chatSubmit:ChatSubmitService, private device:DeviceTypeService){
      this.userType=this.debateAuth.getUser();

      this.device.getDevice().subscribe(data => (this.deviceType=data));

    }
  

    @ViewChild('firstModal') firstModal!: ElementRef;
    @ViewChild('secondModal') secondModal!: ElementRef;
    @ViewChild('thirdModal') thirdModal!: ElementRef;
    
    
    openFirstModal() {
      this.firstModal.nativeElement.style.display = 'flex';
      this.firstModal.nativeElement.classList.add('open1');
    }
    
    closeFirstModal(event?: Event) {
      // If an event is provided, this is an overlay click
      if (event && this.secondModal.nativeElement.classList.contains('open')) {
        this.closeSecondModal();
      } else if (!this.secondModal.nativeElement.classList.contains('open')) {
        this.firstModal.nativeElement.classList.remove('open1');
      
      }
    }
    
    openSecondModal() {
    
      this.secondModal.nativeElement.classList.add('open');
    
    }
    
    
    closeSecondModal() {
      this.isSecondModalOpen = false;
      this.secondModal.nativeElement.classList.remove('open');
    }




    ngAfterViewChecked() {
      this.scrollToBottom();
    }

    panelBlur (number:number) {
      this.blurState=number;
     
    }
    ngOnInit() {
      const id = this.route.snapshot.paramMap.get('id');
      this.cardService.cards$.subscribe((cards) => {
        this.cards = cards;  // Populate the cards array
        const card = cards.find((card) => card.id === id);
        if (card !== undefined) { // Check if card is not undefined
          this.card = card;
          this.isRanked = this.card.ranked!;
          if (this.isRanked) {
            this.loadGameRules();
          }
        } else {
          // Handle case when card is not found, e.g., redirect or show a message
        }
      });
      this.getLink = this.router.url;
      
      /*   use this one when it goes live. it will access the actual website link;
      this.getLink = window.location.href;
      */


    }
    generateRoute(card: any) {
      return ['/debate', card.id];
    }
    
    copyLinkToClipboard() {
      // Code to copy link to clipboard here...
      
      this.snackBar.open('Link copied to clipboard', '', {
        duration: 1000,
        verticalPosition: 'top'
      });
      
    }
    loadGameRules() : void {
      this.debateFeatures = true;
      this.intervalId = setInterval(() => {
    
      }, 3000)
    
    }

   

    post() {
      //this should direct to the sequitur post form with the getLink data
    }
    updateText(newText: string) {
      this.text = newText;
      this.scrollToBottom();
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
      if (this.selectedButton!=-1){
        if (this.selectedButton==1) {
          this.isSecondModalOpen = true;
          this.openSecondModal();
        }
        else {
      this.openFirstModal();}
      }
      else {
        this.closeFirstModal();
        this.closeSecondModal();
      }
      //this.panelState = this.panelState === 'hidden' ? 'visible' : 'hidden';
    }
  
    startDrag(event: MouseEvent): void {
      this.startY = event.clientY;
      document.addEventListener('mousemove', this.handleDrag);
      document.addEventListener('mouseup', this.stopDrag);
    }
  
    handleDrag = (event: MouseEvent) => {
      if (this.startY && event.clientY - this.startY > 50) { // Drag down by 50 pixels to close
        this.closeFirstModal();
        this.closeSecondModal();
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
      if (type =='spectator'||type=='speaker'||type=='host'){this.userType=type;}
      if (type =='ranked') {this.isRanked=true;}
      if (type =='normal') {this.isRanked = false;}
     
    }



    
toggleVideo () {
 
}
  }

  
  

