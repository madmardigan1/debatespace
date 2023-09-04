import { Component, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-chat-space',
  templateUrl: './chat-space.component.html',
  styleUrls: ['./chat-space.component.css']
})
export class ChatSpaceComponent implements AfterViewInit, OnChanges {
scrollChat: string = '';
@Input() displayText: string = '';

ngAfterViewInit(): void {
  let counter = 0;
  const intervalId = setInterval(() => {
    this.scrollChat += "chat update<br/>";
    counter++;
    if (counter >= 40) {
      clearInterval(intervalId);
    }
  }, 1000);
}


ngOnChanges(changes: SimpleChanges): void {
  if (changes['displayText']) {
    
    const change = changes['displayText'];
   
    if (change.previousValue !== change.currentValue) {
      this.scrollChat += change.currentValue + '<br/>';
    }
  }
}


updateChat(text:string): void {
  this.scrollChat += text + "<br/>";
}
}
