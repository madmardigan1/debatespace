import { Component} from '@angular/core';
import { CardDataService, Card } from '../space-service.service';
import { DebateAuthService } from '../debate-auth.service';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  
})
export class HomeComponent{
  userForm: FormGroup;
  matchWindow = false;
  items: string[] = [];
  cards: Card[] = [];
  selectedOption: string = '';
  spinner = false;

  constructor(private cardService: CardDataService, private debateAuth: DebateAuthService, private fb: FormBuilder, private modalService: NgbModal) {
    this.userForm = this.fb.group({
      roles: this.fb.group({
        speaker: [false],
        host: [false]
      }),
      topics: this.fb.array([])
    });
    
    this.cardService.cards$.subscribe((data) => {
      this.cards = data;
    });
  }

authorize(typeofUser: string) {
  this.debateAuth.setUser(typeofUser);
}
 
findMatch() : void {
  this.matchWindow = true;
}

submitForm(): void {
  this.matchWindow = false;
  this.spinner=true;
}

get topics(): FormArray {
  return this.userForm.get('topics') as FormArray;
}

addTopic(topic: string): void {
  this.topics.push(this.fb.control(topic));
}

}
