import { Component, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate, query, animateChild, group } from '@angular/animations';
import { MatchMakerService } from './match-maker.service';
import { Card, CardDataService } from 'src/app/space-service.service';
import { DebateAuthService } from '../debate-auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-match-maker',
  templateUrl: './match-maker.component.html',
  styleUrls: ['./match-maker.component.css'],
})

export class MatchMakerComponent {

matchList : Card[]=[];
counter=0;
@Output() closeClicked = new EventEmitter<void>();

  constructor (private matchMaker: MatchMakerService, private cardServ: CardDataService, private router:Router, private debateAuth:DebateAuthService) {

    this.matchMaker.getTopics().subscribe((data) => {
      this.matchList = data;
   
    });
  }

  nextMatch () {
    if (this.counter < this.matchList.length-1) {
    this.counter +=1;
  }
}

  previousMatch () {
    if (this.counter >0) {
      this.counter -= 1;
    }
  }

  join (counter: Card) {
    this.cardServ.updateCard(counter.id, 'steve','speaker',400,'/assets/Steve.jpeg');
    this.debateAuth.setUser('speaker');
    this.closeClicked.emit();
    this.router.navigate(['/debateMob',counter.id]);
  }
  end () {
    this.closeClicked.emit();
  }
}
