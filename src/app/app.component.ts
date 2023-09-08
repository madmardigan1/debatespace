import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CardDataService, Card } from './space-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'debatespaces';
  text: string = '';
searchQuery: string = '';

form: FormGroup;
cards: Card[] = [];

constructor(private fb: FormBuilder, private cardService: CardDataService) {
  this.form = this.fb.group({
   
    name: [''],
    number: [''],
  });
  console.log("teset");
  this.cardService.cards$.subscribe((data) => {
    this.cards = data;
  });
}

cardst = [
  { title: 'Card 1', description: 'Description 1' },
  {  title: 'Card 2', description: 'Description 2' },
  {  title: 'Card 3', description: 'Description 3' },
  {  title: 'Card 4', description: 'Description 4' },
  {  title: 'Card 5', description: 'Description 5' },
  // Add more cards as needed
];

cardGroups: any[] = [];

ngOnInit() {
  this.cardGroups = this.groupCards(this.cardst, 3);
}

groupCards(cards: any[], groupSize: number): any[] {
  const groups = [];
  for (let i = 0; i < cards.length; i += groupSize) {
    groups.push(cards.slice(i, i + groupSize));
  }
  return groups;
}  
}
