import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CardDataService, Card, Topics } from '../space-service.service';
import { Router } from '@angular/router';
import { DebateAuthService } from '../home/debate-auth.service';
import { TopicMenuService } from '../home/topic-menu/topic-menu.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { UserSearchService } from '../user-search/user-search.service';
@Component({
  selector: 'app-spacecreate',
  templateUrl: './spacecreate.component.html',
  styleUrls: ['./spacecreate.component.css'],
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
export class SpacecreateComponent implements AfterViewInit {
  selectionPane = true;
  selectionPaneType = '';
  isToggled: boolean = false;
  inviteSent='';
  additionalOptionValue: boolean = false;
  form: FormGroup;
  cards: Card[] = [];
  topic: string[] = [];
  private subscription!: Subscription;
  private subscription2!: Subscription;
  textplaceholder: 'What do you want to talk about?' | 'state your claim...' = 'What do you want to talk about?';


  isRanked = false;
  @ViewChild('topicInput') topicInput!: ElementRef;
  constructor(private userSearch:UserSearchService,private location:Location, private fb: FormBuilder, private topicMenu: TopicMenuService,private cardService: CardDataService, private router: Router, private debateAuth: DebateAuthService) {
   // Inside your component class constructor:
this.form = this.fb.group({
  isToggled2: [false],
  description: [''],
  isToggled1: [false],  // new form control for toggle
  additionalOptionValue: [false]  // new form control for checkbox
});


    this.cardService.cards$.subscribe((data) => {
      this.cards = data;
    });

    this.subscription =this.topicMenu.getTopics().subscribe(topics => {
      this.topic=topics;
    });
    this.subscription2 =this.userSearch.listentoInvite().subscribe(topics => {
      if(topics !== '') {
        this.inviteSent=topics;
        this.togglePanel();
      }
    });
  }

  ranked() {  
    this.textplaceholder = this.textplaceholder === 'What do you want to talk about?' ? 'state your claim...' : 'What do you want to talk about?';

}


inviteToggle() {}
get isToggled1(): boolean {
  return this.form.get('isToggled1')?.value;
}

  ngAfterViewInit() {
    this.topicInput.nativeElement.focus();
    
  }

 
  speakers?: string[]; // Optional speakers array
  spectators?: string[]; // Optional spectators array
  totalUsers?: number; 

 
  

    submit() {
      const formData = this.form.value;
      const id = Date.now().toString();
      const number = 1;
      const ranked = this.form.get('isToggled2')?.value;
      this.cardService.addCard({ ...formData,user: [{name:"steve",role:'host',rank:3,photoUrl:'/assets/Steve.jpeg'}],topic:this.topic, id: id, ranked:ranked });
      this.cardService.addTag(this.topic);
      this.debateAuth.setUser('host');
      this.router.navigate(['/debateMob',id]);
    }
  paneSelected(type:string) {
    this.selectionPane=false;
    this.selectionPaneType=type;
  }

  goBack() {
    this.location.back();
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

