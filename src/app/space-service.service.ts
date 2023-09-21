import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Card {
  id: string;
  topic: string;
  description: string;
  number: number;
  entrancefee?: number;
}

@Injectable({
  providedIn: 'root'
})

export class CardDataService {
  private cards = new BehaviorSubject<Card[]>([
    {id: '1', topic: "Politics", description: "Follow me for the latest updates on Ukraine.  We're digging deep into recent government corruption", number: 10},
    {id: '2', topic: "Technology", description: "Latest breakthroughs in AI", number: 50},
    {id: '3', topic: "Science", description: "Mars rover finds something interesting", number: 20},
    {id: '4', topic: "Sports", description: "Olympics highlights", number: 25},
    {id: '5', topic: "Environment", description: "Climate change and its effects", number: 30},
    {id: '6', topic: "Economy", description: "Market trends for this month", number: 40},
    {id: '7', topic: "Arts", description: "Review of a popular art gallery", number: 15},
    {id: '8', topic: "Lifestyle", description: "Trending fashions for this year", number: 22},
    {id: '9', topic: "Travel", description: "Best destinations for post-pandemic travel", number: 35},
    {id: '10', topic: "Health", description: "Tips for a healthy lifestyle", number: 28}
  ]);
  cards$ = this.cards.asObservable();

  addCard(card: Card) {
    const currentCards = this.cards.getValue();
    this.cards.next([...currentCards, card]);

    // Here, operate on 'currentCards' directly after updating it

}

}

