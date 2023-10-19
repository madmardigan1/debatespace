import { Component, AfterViewChecked, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardDataService, Card } from '../space-service.service';
import { DebateAuthService } from '../home/debate-auth.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ChatSpaceMobComponent } from './chat-space-mob/chat-space-mob.component';
import { DebateSpaceService } from './debate-space.service';
import { ChatSubmitService } from './chat-submit-mob/chat-submit.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeviceTypeService } from '../device-type.service';
import { NodespaceServiceService } from './node-space-mob/nodespace-service.service';
import { SpeechService } from './node-space-mob/speech-service.service';
import { Subscription } from 'rxjs';
import { NodeSpaceMobComponent } from './node-space-mob/node-space-mob.component';
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
        height: '50px',
      })),
      state('fully-expanded', style({
        height: '70%',
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
  @ViewChild('liveVideo', { static: false }) liveVideoElement!: ElementRef;
  @ViewChild('chatView') private chatContainer!: ElementRef;
  @ViewChild('inputTag') inputTag!: ElementRef;
  @ViewChild('inputReply') inputReply!: ElementRef;
  @ViewChild('firstModal') firstModal!: ElementRef;
  @ViewChild('secondModal') secondModal!: ElementRef;
  @ViewChild('secondModalContent') secondModalContent!: ElementRef;
  @ViewChild(NodeSpaceMobComponent, { static: false }) nodeChild!: NodeSpaceMobComponent;
  //game rules
  isRanked = true;
  reactionType = 'neutral';

  //other variables
  private phrasesSubscription: Subscription | null = null;
  transcript = '';
  selectedButton: number = -1;
  isRecordingVideo = false;
  card!: Card;
  tagStatus = true;
  tagvalue = '';
  panelType = "nodes";
  userType: string = 'host';
  forumToggle = false;
  toggleChat=false;
  isRecording = '';
  nodeState: string = 'expanded';
  theRestState: string = 'shrunk';
  expandShrink = false;
  value = '';
  deviceType = false;
  getLink: string = '';
  isSecondModalOpen = false;
  soundClip: any = null;
  videoClip: any = null;
  startY: number | null = null;
  selectedNode: any = null;

  constructor(
    private speechService: SpeechService,
    private snackBar: MatSnackBar,
    private debateSpace: DebateSpaceService,
    private route: ActivatedRoute,
    private cardService: CardDataService,
    private router: Router,
    private debateAuth: DebateAuthService,
    private nodeService: NodespaceServiceService,
    private device: DeviceTypeService) {
    this.userType = this.debateAuth.getUser();
    this.device.getDevice().subscribe(data => (this.deviceType = data));
  }

  //this function retrieves the unique ID from the URL and uses it to retrieve the card information from the database.  Each instance of a Node is stored with a unique ID.
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.cardService.cards$.subscribe((cards) => {
      const card = cards.find((card) => card.id === id);
      if (card !== undefined) { // Check if card is not undefined
        this.card = card;
        this.isRanked = this.card.ranked!;

      } else {
        // Handle case when card is not found, e.g., redirect or show a message
      }
   
    });
    this.nodeService.getNodeText().subscribe(messages => {
      this.selectedNode = messages.node;
      
    })
    //used to rerieve the URL information for local host.  Replace with below function when it goes live.
    this.getLink = this.router.url;


    /*   use this one when it goes live. it will access the actual website link;
    this.getLink = window.location.href;
    */
  }

  //this maintains the chat container scrolled to bottom.
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  generateRoute(card: any) {
    return ['/debate', card.id];
  }

  //this function is a placeholder that is designed to copy the URL to the clipboard.  Requires an actual server.
  copyLinkToClipboard() {
    this.snackBar.open('Link copied to clipboard', '', {
      duration: 1000,
      verticalPosition: 'top'
    });

  }

  // This function adds a tag attribute to the node being added.  When tagStatus is set to true, the modal dispays the comment form.  The timer delay prevents a race event so that the panel autofocuses.
  addTag(event: Event) {
    event.preventDefault();
    this.tagStatus = true;
    setTimeout(() => {
      this.inputReply.nativeElement.focus();
    }, 50);  // Delay of 50 milliseconds
  }

  // This function is called whenever the chat container is updated and ensures that the chat container is scrolled to the bottom
  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {

    }
  }

  //this function triggers an animation state to alter the height of the lower pane and display the correct panel on the lower portion of the screen.
  toggleLowerDisplay(panelType: string): void {
    this.panelType = panelType;
    if (panelType == 'nodes') {
      this.forumToggle = !this.forumToggle
      this.nodeChild.toggleSwipeRExpansion();
    }
    if (panelType =='chat') {
      this.toggleChat = !this.toggleChat;
      if (this.toggleChat) {
      this.nodeState = 'shrunk';
      this.theRestState = 'expanded';
      }
      else {
        this.nodeState = 'expanded';
        this.theRestState = 'shrunk';
      }
    }
 
  }

  //begins recording audio or video and begins speech recognition.  The type variable is used to determine if the recording is audio or video.
  startRecording(type: boolean = false): void {
    if (type === true) {
      this.isRecording = 'videoFalse';
    }
    else {
      this.isRecording = 'soundFalse';
    }
    this.speechService.startListening();
    this.phrasesSubscription = this.speechService.phrases.subscribe(transcript => {
      this.transcript = transcript;

    });
    this.speechService.startRecording(type);
    if (type === true) {
      this.isRecordingVideo = true;
      this.speechService.getStream({ video: true, audio: true })
        .then(() => {
          // Bind the stream only after ensuring it's been acquired.

          this.speechService.bindStreamToVideoElement(this.liveVideoElement.nativeElement);

        })
        .catch(error => {
          console.error('Error accessing camera:', error);
        });
    }
  }

  //stops recording and resets all init variables.  It also closes the modal and sends the information to the node component.
  stopRecording(): void {
    
    this.speechService.stopListening();
    if (this.phrasesSubscription) {
      this.phrasesSubscription.unsubscribe();
      this.phrasesSubscription = null;
    }
    this.speechService.stopAndReturnMedia().then(result => {
      if (result) {
        const { blob, type } = result;
        if (type === 'audio') {
          this.soundClip = blob;
        } else if (type === 'video') {
          this.videoClip = blob;
        }
        
        this.debateSpace.Toggle(this.transcript, this.soundClip, this.videoClip, this.reactionType, this.tagvalue);
        this.soundClip = null;
        this.videoClip = null;
        this.isRecordingVideo = false;
        this.transcript = '';
        this.isRecording = '';
        this.closeSecondModal();
      }
    });
  }

  // This function is called whenever the user submits a text response.  It closes the modal and sends the text to the node component
  submitTextResponse(event: Event) {
    event.preventDefault();
    if (this.value) {
      this.debateSpace.Toggle(this.value, null, null, this.reactionType, this.tagvalue);
      this.value = '';
    }
    this.closeSecondModal();
  }

  //used to open the first modal in most cased which displays different panels depending on the button pressed
  togglePanel(togglenumber: number): void {
    this.selectedButton = togglenumber;
    if (this.selectedButton != -1) {
      if (this.selectedButton == 1) {
        this.reactionType = 'neutral';
        this.isSecondModalOpen = true;
        this.openSecondModal();
      }
      else {
        this.openFirstModal();
      }
    }
    else {
      this.closeFirstModal();
      this.closeSecondModal();
    }

  }

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
  
      this.inputTag.nativeElement.focus();
  
  }

  //triggerd when the user clicks on the reaction buttons.  It opens the second modal and sets the reaction type.
  togglePanelReaction(type: string) {
    this.selectedButton = 1
    this.tagStatus = false;
    this.reactionType = type;
    this.isSecondModalOpen = true;
    this.tagvalue = '';
    this.openSecondModal();
  }

  closeSecondModal() {
    this.isSecondModalOpen = false;
   

  }

  //used to detect initial drag event for modal popups.  If the user drags down by 50 pixels, the modal closes
  startDrag(event: MouseEvent): void {
    this.startY = event.clientY;
    document.addEventListener('mousemove', this.handleDrag);
    document.addEventListener('mouseup', this.stopDrag);
  }

  //called after drag event triggers.  If the user drags down by 50 pixels, the modal closes
  handleDrag = (event: MouseEvent) => {
    if (this.startY && event.clientY - this.startY > 50) { // Drag down by 50 pixels to close
      this.closeFirstModal();
      this.closeSecondModal();
      this.stopDrag();

    }
  }

  //used to handle drag events for the modal popups.  If the user drags down by 50 pixels, the modal closes
  stopDrag = () => {
    this.startY = null;
    document.removeEventListener('mousemove', this.handleDrag);
    document.removeEventListener('mouseup', this.stopDrag);

  }

  //remove this for actual production.  Allows switching between modes
  simulate(type: string): void {
    if (type == 'spectator' || type == 'speaker' || type == 'host') { this.userType = type; }
    if (type == 'ranked') { this.isRanked = true; }
    if (type == 'normal') { this.isRanked = false; }
  }
}




