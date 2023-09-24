import { Component, OnInit } from '@angular/core';
import { CardDataService } from '../space-service.service';
import { Card } from '../space-service.service';
import { DebateAuthService } from '../home/debate-auth.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
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
  matchedTopics: any[]=[];
  constructor (private cardService: CardDataService, 
    private debateAuth: DebateAuthService, 
    private acroute: ActivatedRoute, private router:Router) {

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

onSearch() {
  if (this.searchTerm) {
    if (this.searchType=='topic'){
    this.matchedTopics = this.cards
      .map(card => card.topic) // Get all topic arrays
      .reduce((acc: string[], curr: string[]) => acc.concat(curr), []) // Flatten the topic arrays into one
      .filter((topic: string) => topic.toLowerCase().includes(this.searchTerm.toLowerCase())); // Filter by the search term
  }
  if (this.searchType == 'user') {
    this.matchedTopics = Array.from(
      new Set(
        this.cards
          .map(card => card.user.map(user => user.name)) // Get all names
          .reduce((acc: string[], curr: string[]) => acc.concat(curr), []) // Flatten the names into one
          .filter((name: string) => name.toLowerCase().includes(this.searchTerm.toLowerCase())) // Filter by the search term
      )
    );
   
  }
  
} else {
    this.matchedTopics = [];
  }
}

searchbutton (search :string) {
this.searchTerm=search;
this.search();
}

search () {
  this.matchedTopics=[];
 
  if (this.searchType == 'topic') {
  this.matchedCards = this.cards.filter(card => {

    return card.topic.some(cardTopic => cardTopic.toLowerCase().includes(this.searchTerm.toLowerCase()));
});
  }
  if (this.searchType == 'user') {
    this.matchedCards = this.cards.filter(card => {
      return card.user.some(u => 
        u.name.toLowerCase().includes(this.searchTerm.toLowerCase()) && u.role === 'host'
      );
    });
  }
  this.searchTerm='';

}
ngOnInit(): void {
  
}
join(card:Card) {
  this.debateAuth.setUser('spectator');
  this.cardService.updateCard(card.id,"Steve",'spectator',3,'/assets/Steve.jpeg')
  this.router.navigate(['/debateMob',card.id]);
}

toggleSearch (type:string) {
  this.searchType = type;
  this.matchedCards=[];
}

}
