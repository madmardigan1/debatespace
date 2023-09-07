import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardDataService, Card } from '../space-service.service';

@Component({
  selector: 'app-card-details',
  templateUrl: './card-details.component.html',
})
export class CardDetailsComponent implements OnInit {
  card!: Card;

  constructor(private route: ActivatedRoute, private cardService: CardDataService) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.cardService.cards$.subscribe((cards) => {
      const card = cards.find((card) => card.id === id);
      if (card !== undefined) { // Check if card is not undefined
        this.card = card;
      } else {
        // Handle case when card is not found, e.g., redirect or show a message
      }
    });
  }
  
}
