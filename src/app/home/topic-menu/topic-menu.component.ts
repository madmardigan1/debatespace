import { Component } from '@angular/core';
import { TopicMenuService } from './topic-menu.service';
import { CardDataService } from 'src/app/space-service.service';
import { Card } from 'src/app/space-service.service';
import { Location } from '@angular/common';
@Component({
  selector: 'app-topic-menu',
  templateUrl: './topic-menu.component.html',
  styleUrls: ['./topic-menu.component.css']
})
export class TopicMenuComponent {
  cards: Card[] =[];
  topicSelection=false;
  joinState=false;
  savedTopics: string[] = [];
  expandPane=-2;
  constructor(private location: Location,private topicServ:TopicMenuService, private cardService:CardDataService) {
    this.cardService.cards$.subscribe((data) => {
      this.cards = data;
    });
    
  }

  selectTopics () : void {
    this.topicSelection = !this.topicSelection;
  }
  
  closeMenu () : void {
    this.topicSelection = !this.topicSelection;
    this.savedTopics = [];
  }
  
  expand (select:number) : void {
    this.expandPane = select;
  }
  
  saveTopic (list:string) : void {
    this.savedTopics.push(list);
  }
  
  addTopics ():void{
    this.topicServ.addTopics(this.savedTopics);
    this.goBack();
  }
  goBack(): void {
    this.location.back();
  }
}
