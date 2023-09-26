import { Component,ViewChild, ElementRef, AfterViewInit, TemplateRef } from '@angular/core';
import { CardDataService, Card, Topics, User } from '../space-service.service';
import { DebateAuthService } from './debate-auth.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Carousel } from './carousel';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { TopicMenuService } from './topic-menu/topic-menu.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { MatchMakerService } from './match-maker/match-maker.service';

declare var bootstrap: any;


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
export class HomeComponent implements AfterViewInit{
  savedTopics: string[] = [];
  currentTopics!: Topics; 
  expandPane = -2;
  firstSlide = false;
  topicSelection = false;
  isModalshown = false;
  searchTerm: string = ''; 
  matchmaking: Card[] = [];
  matchsub!:Subscription;
  joinState=false;
  userForm: FormGroup;
  matchWindow = false;
  items: string[] = [];
  private subscription!:Subscription;
  cards: Card[] = [];
  selectedOption: string = '';
  spinner = false;
  matchedTopics: any[] = []; 
  selectedButton=0;

  dataArray: Carousel[] = [
    {
        title: 'Welcome to Sequitur Nodes',
        description: 'home for live multi-media discussions',
        button: 5
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

  constructor(private activatedRoute:ActivatedRoute,private matchMaker: MatchMakerService,private router: Router,private topicMenu: TopicMenuService,private cardService: CardDataService, private debateAuth: DebateAuthService, private fb: FormBuilder, private modalService: NgbModal) {
    this.userForm = this.fb.group({
      isToggled : false
    });
    
    this.cardService.cards$.subscribe((data) => {
      this.cards = data;
    });

    this.subscription =this.topicMenu.getTopics().subscribe(topics => {
      this.savedTopics=topics;
      this.closeSecondModal();
      if (this.savedTopics.length>0) {
        
       
      }
    });

    this.cardService.getTopics().subscribe(data => {
      this.currentTopics = data;
      
    });
    
  

  
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
    this.joinState=false;
  }
}

openSecondModal() {

  this.secondModal.nativeElement.classList.add('open');

}


closeSecondModal() {
  this.secondModal.nativeElement.classList.remove('open');
}


openThirdModal() {

  this.thirdModal.nativeElement.classList.add('open');

}


closeThirdModal() {
  this.thirdModal.nativeElement.classList.remove('open');
  this.matchsub.unsubscribe();
  this.matchmaking=[];
  this.joinState=false;
}




  

  ngAfterViewInit(): void {
   
  

 
  }
  removeTopic (data:any):void {
    this.savedTopics.splice(data);
  }

  onSearch() {
    this.matchedTopics = [];
    if (this.searchTerm) {
      // Iterate over each category in the currentTopics
      for (let category in this.currentTopics) {
        // Use Array.prototype.push.apply to combine the results of each category's search into the matchedTopics array
        Array.prototype.push.apply(
          this.matchedTopics,
          this.currentTopics[category].filter(topic => topic.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
        );
      }
    }
 
  }

  objectKeys(obj: any) {
    return Object.keys(obj);
  }

authorize(card: Card) {
  this.debateAuth.setUser('spectator');
  this.cardService.updateCard(card.id,"Steve",'spectator',3,'/assets/Steve.jpeg')
  this.router.navigate(['/debateMob',card.id]);
}
 

submitForm(): void {
  this.firstSlide=false;
  this.selectedButton = 0;
  this.spinner=true;
  this.joinState=false;
 this.panelState='hidden';
 this.closeFirstModal();
 this.matchMaker.matchRequest({name: 'Steve', role: 'host', rank: 1, photoUrl: '/assets/Steve.jpeg'}, this.savedTopics, this.userForm.get('isToggled')!.value);
 this.matchsub=this.matchMaker.getTopics().subscribe((data) => {
  this.matchmaking = data;
  if (this.matchmaking.length > 0) {
    this.openThirdModal();  // This is the method that opens the modal programmatically.
  }
});
 

 
}


addTopicsMenu () {
 
  this.router.navigate(['home/topicMenu/:false']);
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
 
  this.selectedButton=togglenumber;
  //this.firstSlide=true;
  this.openFirstModal();
}

  else {
    this.selectedButton!=togglenumber;
    this.closeFirstModal();
   // this.firstSlide=false;
  }
 

  //this.panelState = this.panelState === 'hidden' ? 'visible' : 'hidden';
  
  

}

browse(topic:string) {

  this.router.navigate(['/browse', topic]);
}

startDrag(event: MouseEvent): void {
  this.startY = event.clientY;
  document.addEventListener('mousemove', this.handleDrag);
  document.addEventListener('mouseup', this.stopDrag);
}

handleDrag = (event: MouseEvent) => {
  if (this.startY && event.clientY - this.startY > 50) { // Drag down by 50 pixels to close
    this.closeFirstModal();
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

selectTopics () : void {
  this.topicSelection = !this.topicSelection;
}

closeMenu () : void {
  this.topicSelection = !this.topicSelection;
  this.savedTopics = [];
}

expand (select:number) : void {
  this.expandPane = select;
}

saveTopic (list:string) : void {
  this.savedTopics.push(list);
}

addTopics ():void{
  this.topicSelection = !this.topicSelection;
  console.log(this.savedTopics)
  this.joinState=true;
}
}
