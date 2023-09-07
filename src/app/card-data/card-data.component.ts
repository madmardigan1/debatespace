import { Component, Input } from '@angular/core';
import { Card } from '../space-service.service';
@Component({
  selector: 'app-card-data',
  templateUrl: './card-data.component.html',
  styleUrls: ['./card-data.component.css']
})
export class CardDataComponent {
  @Input() card!: Card;
}
