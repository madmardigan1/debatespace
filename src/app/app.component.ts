import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'debatespaces';
  text: string = '';

  updateText(newText: string) {
    this.text = newText;
  }
}
