import { Component } from '@angular/core';
import { CardDataService } from '../space-service.service';
import { Card } from '../space-service.service';
import { DebateAuthService } from '../home/debate-auth.service';
@Component({
  selector: 'app-browse-page',
  templateUrl: './browse-page.component.html',
  styleUrls: ['./browse-page.component.css']
})
export class BrowsePageComponent {

  cards: Card[] = [];

constructor (private cardService:CardDataService, private debateAuth: DebateAuthService) {
  this.cardService.cards$.subscribe((data) => {
    this.cards = data;
  });
}
authorize(typeofUser: string) {
  this.debateAuth.setUser(typeofUser);
}
}
