import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef, SimpleChanges} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { UserSearchService } from 'src/app/user-search/user-search.service';
import { Subscription } from 'rxjs';
import { CardDataService, Card, User } from 'src/app/space-service.service';
@Component({
  selector: 'app-user-summary-mob',
  templateUrl: './user-summary-mob.component.html',
  styleUrls: ['./user-summary-mob.component.css'],
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
export class UserSummaryMobComponent implements OnInit {
  panelToggle=0;
  public selectedPhoto!: string;
  public selectedName!: string;
  subscription!: Subscription;
  subscription2!:Subscription;
  selectedMoment!: number;
  panelReveal = false;
  userToggle = 'all';
  speakerCount : User[] = [];
  hostCount : User[] = [];
  cardUsers: User[]=[]; 
  spectatorCount : User[]=[]; 
  cardx!: User;
  @Input() card!: string;
  @Output() closeClicked = new EventEmitter<void>();
  public users = [
    { name: 'Steve', role: 'host', rank: 300, photoUrl: 'assets/Steve1.jpeg' },
  
  
    // ... add more users as needed
  ];

  constructor (private cd: ChangeDetectorRef,private userSearch: UserSearchService, private cardService: CardDataService) {
    this.subscription2 =this.userSearch.listentoInvite().subscribe(topics => {
      if(topics !== '') {
        this.togglePanel();
      }
    });
    
  }


 getDetails(user:User){}
  
 ngOnInit(): void {
  this.cardUsers = []; // Initialize to empty array
  
  this.cardService.getcards().subscribe((cards) => {
      const cardtype = cards.find((card) => card.id === this.card);

      if (cardtype && cardtype.user) { // Check if card and user property exist
          // Storing all users associated with this card
          this.cardUsers = cardtype.user;
          
         
          // Filtering users based on their roles
          this.hostCount = this.cardUsers.filter(user => user.role === 'host');
          this.speakerCount = this.cardUsers.filter(user => user.role === 'speaker');
          this.spectatorCount = this.cardUsers.filter(user => user.role === 'spectator');
          console.log(this.hostCount);
      } else {
          // Handle case when card is not found or user property is missing/incorrect
        
      }
  });
  }



 
  
panelState: 'hidden' | 'visible' = 'hidden';
startY: number | null = null;

togglePanel(): void {

  this.panelState = this.panelState === 'hidden' ? 'visible' : 'hidden';

}
toggleUsers(type:string):void {
  this.userToggle=type;
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
}
  
  

