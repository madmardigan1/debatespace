import { Component} from '@angular/core';
import { CardDataService, Card } from '../space-service.service';
import { DebateAuthService } from '../debate-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  
})
export class HomeComponent{
  items: string[] = [];
  cards: Card[] = [];
  constructor(private cardService: CardDataService, private debateAuth: DebateAuthService) {
    this.cardService.cards$.subscribe((data) => {
      this.cards = data;
    });
  }

authorize(typeofUser: string) {
  this.debateAuth.setUser(typeofUser);
}
 
}
