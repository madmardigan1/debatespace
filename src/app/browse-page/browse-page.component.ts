import { Component, OnInit } from '@angular/core';
import { CardDataService } from '../space-service.service';
import { Card } from '../space-service.service';
import { DebateAuthService } from '../home/debate-auth.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-browse-page',
  templateUrl: './browse-page.component.html',
  styleUrls: ['./browse-page.component.css']
})
export class BrowsePageComponent implements OnInit {
  matchedCards: any[] = []; 
  cards: Card[] = [];
  topic!:string|null;
  searchTerm='';
  searchType = 'topic';
  constructor (private cardService: CardDataService, 
    private debateAuth: DebateAuthService, 
    private acroute: ActivatedRoute) {

this.topic = this.acroute.snapshot.paramMap.get('topic');

this.cardService.cards$.subscribe((data) => {
this.cards = data;

// Filtering cards based on the topic
this.matchedCards = this.cards.filter(card => {
// Check if the card's topics array contains the desired topic
return card.topic.some(cardTopic => cardTopic.toLowerCase()  === this.topic!.toLowerCase() );
});
});
}

search () {
  if (this.searchType == 'topic') {
  this.matchedCards = this.cards.filter(card => {

    return card.topic.some(cardTopic => cardTopic.toLowerCase().includes(this.searchTerm.toLowerCase()));
});
  }
  if (this.searchType == 'user') {
    this.matchedCards = this.cards.filter(card => {
    return card.user.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

}
ngOnInit(): void {
  
}
authorize(typeofUser: string) {
  this.debateAuth.setUser(typeofUser);
}

toggleSearch (type:string) {
  this.searchType = type;
}

}
