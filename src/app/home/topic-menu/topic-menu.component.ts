import { Component, OnChanges, OnInit, Output, EventEmitter } from '@angular/core';
import { TopicMenuService } from './topic-menu.service';
import { CardDataService, Topics } from 'src/app/space-service.service';
import { Card, Topic, } from 'src/app/space-service.service';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DeviceTypeService } from 'src/app/device-type.service';

@Component({
  selector: 'app-topic-menu',
  templateUrl: './topic-menu.component.html',
  styleUrls: ['./topic-menu.component.css']
})
export class TopicMenuComponent implements OnInit {
  cards: Card[] = [];
  currentTopics!: Topics;
  trendingTopics:any=[];
  topicSelection = false;
  joinState = false;
  savedTopics: string[] = [];
  expandedStates: { [key: number]: boolean } = {};
  expandPane: any = [];
  deviceType = false;
  addTopic = 'false';
  searchTerm: string = '';
  @Output() closeTopics = new EventEmitter<void>();
  matchedTopics: any[] = [];
  parameterValue: string = '';
  constructor(private location: Location, private topicServ: TopicMenuService, private cardService: CardDataService, private route: ActivatedRoute, private device: DeviceTypeService) {
    this.cardService.cards$.subscribe((data) => {
      this.cards = data;
    });
    this.cardService.getTopics().subscribe(data => {
  
        this.currentTopics = data;
        // Flatten the topics and sort by tally
        const flattenedTopics: Topic[] = ([] as Topic[]).concat(...Object.values(data));
        const sortedTopics = flattenedTopics.sort((a, b) => b.tally - a.tally);
        // Return the top 10 topics
        this.trendingTopics = sortedTopics.slice(0, 10);
      });
    
  

    this.device.getDevice().subscribe(data => { this.deviceType = data })

  }
  ngOnInit(): void {
    this.parameterValue = this.route.snapshot.paramMap.get('myParam') || 'defaultValue';


    this.addTopic = this.parameterValue;


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


  selectTopics(): void {
    this.topicSelection = !this.topicSelection;
  }

  closeMenu(): void {
    this.topicSelection = !this.topicSelection;
    this.savedTopics = [];
    this.closeTopics.emit();
  }

  expand(select: number): void {

    this.expandPane[select] = !this.expandPane[select];
    this.expandedStates[select] = !this.expandedStates[select];


  }

  saveTopic(list: string): void {
    this.savedTopics.push(list);
  }

  addTopics(): void {
    this.topicServ.addTopics(this.savedTopics);
    this.cardService.addTag(this.savedTopics);

    if (this.addTopic == 'true') {
      this.location.back();
    }

  }
  goBack(): void {
    this.savedTopics = [];
    this.closeTopics.emit();
    if (this.addTopic == 'true') {

      this.location.back();
    }

  }

  addNewTopic(): void {
    if (this.searchTerm && this.addTopic == 'true') {
      this.saveTopic(this.searchTerm);


      this.searchTerm = ''; // Reset the search term after adding
      this.closeTopics.emit();
    }
  }

  removeTopic(data: any): void {
    this.savedTopics.splice(data);
  }
}
