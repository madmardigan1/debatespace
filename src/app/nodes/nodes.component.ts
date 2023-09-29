import { Component, ViewChild, ElementRef } from '@angular/core';
import { DeviceTypeService } from '../device-type.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TopicMenuService } from '../home/topic-menu/topic-menu.service';
import { MatchMakerService } from '../home/match-maker/match-maker.service';
import { CardDataService, Card } from '../space-service.service';
@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent {
isMobile = false;
selectedButton = 0;
userForm: FormGroup;
savedTopics: string[] = [];
spinner = false;
matchmaking: Card[] = [];
@ViewChild('firstModal') firstModal!: ElementRef;
@ViewChild('secondModal') secondModal!: ElementRef;
@ViewChild('thirdModal') thirdModal!: ElementRef;

constructor (private device:DeviceTypeService, private fb:FormBuilder, private topic:TopicMenuService, private matchMaker:MatchMakerService){
    this.device.getDevice().subscribe (data => this.isMobile=data);
    this.userForm = this.fb.group({
      isToggled : false
    });

    this.topic.getTopics().subscribe(topics => {
      this.savedTopics=topics;
      this.closeSecondModal();
    });

}

toggleState (data:number) {
  this.selectedButton=data;
  this.openFirstModal();
}




openFirstModal() {
  this.firstModal.nativeElement.classList.add('open1');
}

closeFirstModal(event?: Event) {
  // If an event is provided, this is an overlay click
  if (event && this.secondModal.nativeElement.classList.contains('open')) {
    this.closeSecondModal();
  } else if (!this.secondModal.nativeElement.classList.contains('open')) {
    this.firstModal.nativeElement.classList.remove('open1');
  
  }
}

openSecondModal() {

  this.secondModal.nativeElement.classList.add('open');

}


closeSecondModal() {
  this.secondModal.nativeElement.classList.remove('open');
}


openThirdModal() {

  this.thirdModal.nativeElement.classList.add('open');

}


closeThirdModal() {
  this.thirdModal.nativeElement.classList.remove('open');
  
  this.matchmaking=[];

}

submitForm () {


  this.selectedButton = 0;
  this.spinner=true;
 this.closeFirstModal();
 this.matchMaker.matchRequest({name: 'Steve', role: 'host', rank: 1, photoUrl: '/assets/Steve.jpeg'}, this.savedTopics, this.userForm.get('isToggled')!.value);
 this.matchMaker.getTopics().subscribe((data) => {
  this.matchmaking = data;
  if (this.matchmaking.length > 0) {
    this.openThirdModal();  // This is the method that opens the modal programmatically.
  }
});
 

  
}

}
