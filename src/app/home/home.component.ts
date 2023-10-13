import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CardDataService, Card, Topic } from '../space-service.service';
import { DebateAuthService } from './debate-auth.service';
import { FormBuilder, } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Carousel } from './carousel';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { DeviceTypeService } from '../device-type.service';

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
export class HomeComponent implements OnInit {
  device = true;
  modal1Open = true;
  currentTopics: any = [];
  matchmaking: Card[] = [];
  cards: Card[] = [];
  selectedButton = 0;
  panelState: 'hidden' | 'visible' = 'hidden';
  startY: number | null = null;
  @ViewChild('firstModal') firstModal!: ElementRef;

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
      title: 'Debate Rankings',
      description: 'Check out the ranked debate leaderboards',
      button: 2
    }
  ];

  constructor(private deviceType: DeviceTypeService, private router: Router, private cardService: CardDataService, private debateAuth: DebateAuthService, private fb: FormBuilder, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.deviceType.getDevice().subscribe(type => {
      this.device = type;
    });

    this.cardService.cards$.subscribe((data) => {
      this.cards = data;
    });

    this.cardService.getTopics().subscribe(data => {
      // Flatten the topics and sort by tally
      const flattenedTopics: Topic[] = ([] as Topic[]).concat(...Object.values(data));
      const sortedTopics = flattenedTopics.sort((a, b) => b.tally - a.tally);
      // Return the top 10 topics
      this.currentTopics = sortedTopics.slice(0, 10);
    });
  }

  //placeholder method that should tell the server that a spectator type user has entered the specific node.  The server would then update the cards array with that users stats
  authorize(card: Card) {
    this.debateAuth.setUser('spectator');
    this.cardService.updateCard(card.id, "Steve", 'spectator', 3, '/assets/Steve.jpeg')
    this.router.navigate(['/debateMob', card.id]);
  }

  //opens the modal which houses a few auxiliary items.  Display is set by this.selectedButton
  openFirstModal() {

    this.modal1Open = !this.modal1Open;
    this.firstModal.nativeElement.classList.add('open1');
  }

  closeFirstModal(event?: Event) {
    this.firstModal.nativeElement.classList.remove('open1');
  }

  //method to handle the click event on the carousel buttons
  togglePanel(togglenumber: number | undefined): void {

    if (togglenumber) {

      this.selectedButton = togglenumber;
      this.openFirstModal();
    }
    else {
      this.selectedButton != togglenumber;
      this.closeFirstModal();
    }
  }

  //methods to handle the drag bar event and close the modal dispay
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

  //when a trending topic button is clicked, the user is brought to the search page with the topic as the search term entered
  browse(topic: string) {
    this.router.navigate(['/browse', topic]);
  }

}
