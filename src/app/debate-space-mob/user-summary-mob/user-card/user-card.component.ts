import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent {
  @Input() user: any;
  @Output() userClicked = new EventEmitter<void>();

  send() {
    this.userClicked.emit();
  }
}
