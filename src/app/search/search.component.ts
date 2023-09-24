import { Component, OnInit } from '@angular/core';
import { CardDataService, Topics } from '../space-service.service';
import { Card } from '../space-service.service';
import { DebateAuthService } from '../home/debate-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  matchedCards: any[] = []; 
  currentCards: any[] = [];
  cards: Card[] = [];
  topic='all';
  searchTerm='';
  searchType = 'topic';
  sortType = 'Most Popular'
  constructor (private cardService: CardDataService, 
    private debateAuth: DebateAuthService, private router:Router
    ) {

this.cardService.getcards().subscribe((data) => {
this.cards = data;
this.toggleSearch('all');
this.sort('user.length')
console.log(this.matchedCards);
})
    }

sort (sortType:string) {
  if (sortType === 'user.length') {
    this.sortType = 'Most Popular';
    this.matchedCards = this.matchedCards.sort((a, b) => b.user.length - a.user.length);
} else if (sortType === 'id') {
  this.sortType = 'Most Recent';
    this.matchedCards = this.matchedCards.sort((a, b) => Number(b.id) - Number(a.id)); // Assuming 'id' is a string of numbers
}

}

toggleSearch(type: string): void {
  this.searchType = type;

  if (type == 'all') {
      this.matchedCards = this.cards;
  } else if (type == 'ranked') {
      // Filtering cards based on the ranked property
      this.matchedCards = this.cards.filter(card => card.ranked === true);
  }
}


  join (card:Card) {
    this.debateAuth.setUser('spectator');
  this.cardService.updateCard(card.id,"Steve",'spectator',3,'/assets/Steve.jpeg')
  this.router.navigate(['/debateMob',card.id]);
  };
}



