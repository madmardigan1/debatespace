import { Component, OnChanges} from '@angular/core';
import { TopicMenuService } from './topic-menu.service';
import { CardDataService, Topics } from 'src/app/space-service.service';
import { Card,Topic,  } from 'src/app/space-service.service';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-topic-menu',
  templateUrl: './topic-menu.component.html',
  styleUrls: ['./topic-menu.component.css']
})
export class TopicMenuComponent {
  cards: Card[] =[];
  currentTopics!: Topics; 
  topicSelection=false;
  joinState=false;
  savedTopics: string[] = [];
  expandPane=-2;
  searchTerm: string = ''; 
  matchedTopics: any[] = []; 
  constructor(private location: Location,private topicServ:TopicMenuService, private cardService:CardDataService) {
    this.cardService.cards$.subscribe((data) => {
      this.cards = data;
    });
    this.cardService.getTopics().subscribe(data => {
      this.currentTopics = data;
    });
    
  }

  objectKeys(obj: any) {
    return Object.keys(obj);
  }
  onSearch() {
    this.matchedTopics = [];
    if (this.searchTerm) {
      // Iterate over each category in the currentTopics
      for (let category in this.currentTopics) {
        // Use Array.prototype.push.apply to combine the results of each category's search into the matchedTopics array
        Array.prototype.push.apply(
          this.matchedTopics,
          this.currentTopics[category].filter(topic => topic.name.toLowerCase().includes(this.searchTerm.toLowerCase()))
        );
      }
    }
 
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
    this.cardService.addTag(this.savedTopics);
    this.goBack();
  }
  goBack(): void {
    this.location.back();
  }
  
  addNewTopic(): void {
    if (this.searchTerm) {
        this.saveTopic(this.searchTerm);
      
        
        this.searchTerm = ''; // Reset the search term after adding
    }
  }

  removeTopic (data:any):void {
    this.savedTopics.splice(data);
  }
}