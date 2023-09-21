import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { CardDataService, Card } from '../space-service.service';
import { Router } from '@angular/router';
import { DebateAuthService } from '../home/debate-auth.service';
import { TopicMenuService } from '../home/topic-menu/topic-menu.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
@Component({
  selector: 'app-spacecreate',
  templateUrl: './spacecreate.component.html',
  styleUrls: ['./spacecreate.component.css']
})
export class SpacecreateComponent implements AfterViewInit {
  selectionPane = true;
  selectionPaneType = '';
  isToggled: boolean = false;
  additionalOptionValue: boolean = false;
  form: FormGroup;
  cards: Card[] = [];
  topic: string[] = [];
  private subscription!: Subscription;
  isRanked = false;
  @ViewChild('topicInput') topicInput!: ElementRef;
  constructor(private location:Location,private fb: FormBuilder, private topicMenu: TopicMenuService,private cardService: CardDataService, private router: Router, private debateAuth: DebateAuthService) {
   // Inside your component class constructor:
this.form = this.fb.group({
  description: ['', Validators.required],
  isToggled: [false],
  isToggled1: [false],  // new form control for toggle
  additionalOptionValue: [false]  // new form control for checkbox
});


    this.cardService.cards$.subscribe((data) => {
      this.cards = data;
    });

    this.subscription =this.topicMenu.getTopics().subscribe(topics => {
      this.topic=topics;
    });
  }
  printToggleValue() {
    console.log(this.isToggled);
 }
  toggleRanked() {
    this.isRanked = !this.isRanked;
}

inviteToggle() {}
onToggleChange() {
  this.isToggled = this.form.get('isToggled')?.value;
}

  ngAfterViewInit() {
    this.topicInput.nativeElement.focus();
    
  }
  submit() {
    const formData = this.form.value;
    const id = Date.now().toString();
    const number = 3;
    const topic=this.topic[1];
    this.cardService.addCard({ ...formData,topic:this.topic[1],number:number, id: id });
    this.debateAuth.setUser('host');
    this.router.navigate(['/debateMob', id]);
  }
  paneSelected(type:string) {
    this.selectionPane=false;
    this.selectionPaneType=type;
  }

  goBack() {
    this.location.back();
  }
}

