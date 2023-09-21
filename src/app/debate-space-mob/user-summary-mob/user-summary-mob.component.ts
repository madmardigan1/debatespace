import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UserCardComponent } from './user-card/user-card.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { UserSearchService } from 'src/app/user-search/user-search.service';
import { Subscription } from 'rxjs';
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
export class UserSummaryMobComponent {
  panelToggle=0;
  public selectedPhoto!: string;
  public selectedName!: string;
  subscription2!:Subscription;
  selectedMoment!: number;
  panelReveal = false;
  @Output() closeClicked = new EventEmitter<void>();
  public users = [
    { name: 'Steve', role: 'host', moment: 300, photoUrl: 'assets/Steve1.jpeg' },
  
  
    // ... add more users as needed
  ];

  constructor (private userSearch: UserSearchService) {
    this.subscription2 =this.userSearch.listentoInvite().subscribe(topics => {
      if(topics !== '') {
        this.togglePanel();
      }
    });
  }

  closePanel() {
    // Your logic here
  }

  getDetails(user: any) {
    // Your logic here
  }

  getUsersByRole(role: string) {
 
   
    return this.users.filter(u => u.role === role);
  }
 
  
panelState: 'hidden' | 'visible' = 'hidden';
startY: number | null = null;

togglePanel(): void {

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
}
  
  

