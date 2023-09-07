import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CardDataService, Card } from './space-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
}
