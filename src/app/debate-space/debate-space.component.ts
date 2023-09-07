import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardDataService, Card } from '../space-service.service';

@Component({
  selector: 'app-debate-space',
  templateUrl: './debate-space.component.html',
  styleUrls: ['./debate-space.component.css']
})
export class DebateSpaceComponent implements OnInit {
  text: string = '';
  card!: Card;
  cards!: any[];

  constructor (private route: ActivatedRoute, private cardService: CardDataService, private router: Router){}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.cardService.cards$.subscribe((cards) => {
      this.cards = cards;  // Populate the cards array
      const card = cards.find((card) => card.id === id);
      if (card !== undefined) { // Check if card is not undefined
        this.card = card;
      } else {
        // Handle case when card is not found, e.g., redirect or show a message
      }
    });
  }
  generateRoute(card: any) {
    return ['/debate', card.id];
  }
  
  updateText(newText: string) {
    this.text = newText;
  }
}
