import { Component} from '@angular/core';
import { CardDataService, Card } from '../space-service.service';
import { DebateAuthService } from './debate-auth.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Carousel } from './carousel';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    
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
})
export class HomeComponent{
  joinState=false;
  userForm: FormGroup;
  matchWindow = false;
  items: string[] = [];
  cards: Card[] = [];
  selectedOption: string = '';
  spinner = false;
  selectedButton=0;
  dataArray: Carousel[] = [
    {
        title: 'Welcome to Sequitur Nodes',
        description: 'home for live multi-media discussions',
        photo: 'path/to/first/photo.jpg',
        
    },
    {
        title: 'Upcoming Tournaments',
        description: 'Click below to sign up or get it on your calendar to spectate.  Winner takes home 100 Momentum', 
        button: 1
    },
    {
      title: 'Ranked Ladder',
      description: 'Check out the ranked debate leaderboards',
      button:2
      
      
     }
];

  constructor(private cardService: CardDataService, private debateAuth: DebateAuthService, private fb: FormBuilder, private modalService: NgbModal) {
    this.userForm = this.fb.group({
      roles: this.fb.group({
        speaker: [false],
        host: [false]
      }),
      topics: this.fb.array([])
    });
    
    this.cardService.cards$.subscribe((data) => {
      this.cards = data;
    });
  }

authorize(typeofUser: string) {
  this.debateAuth.setUser(typeofUser);
}
 

submitForm(): void {
  this.selectedButton = 0;
  this.spinner=true;
  this.joinState=false;
 this.panelState='hidden';
}

get topics(): FormArray {
  return this.userForm.get('topics') as FormArray;
}

addTopic(topic: string): void {
  this.topics.push(this.fb.control(topic));
}

panelState: 'hidden' | 'visible' = 'hidden';
startY: number | null = null;

togglePanel(togglenumber: number|undefined): void {
  if (togglenumber) {
  this.selectedButton=togglenumber;}
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
stopDrag = () => {
  this.startY = null;
  document.removeEventListener('mousemove', this.handleDrag);
  document.removeEventListener('mouseup', this.stopDrag);
}

joinToggle () : void {
  this.joinState = !this.joinState;
  }
}
