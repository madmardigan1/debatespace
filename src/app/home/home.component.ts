import { Component} from '@angular/core';
import { CardDataService, Card } from '../space-service.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  
})
export class HomeComponent{
  items: string[] = [];
  cards: Card[] = [];
  constructor(private cardService: CardDataService) {
    this.cardService.cards$.subscribe((data) => {
      this.cards = data;
    });

    

    
    
  }
  /*

  */

 
}
