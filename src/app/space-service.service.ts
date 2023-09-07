import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Card {
  id: string;
  topic: string;
  description: string;
  number: number;
}

@Injectable({
  providedIn: 'root'
})

export class CardDataService {
  private cards = new BehaviorSubject<Card[]>([]);
  cards$ = this.cards.asObservable();

  addCard(card: Card) {
    const currentCards = this.cards.getValue();
    this.cards.next([...currentCards, card]);
  }
}

