import { Component, ViewChild, ElementRef } from '@angular/core';
import { DeviceTypeService } from '../device-type.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TopicMenuService } from '../home/topic-menu/topic-menu.service';

import { CardDataService, Card } from '../space-service.service';
@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.css']
})
export class NodesComponent {
isMobile = false;
selectedButton = 0;
@ViewChild('firstModal') firstModal!: ElementRef;
@ViewChild('secondModal') secondModal!: ElementRef;
@ViewChild('thirdModal') thirdModal!: ElementRef;

constructor (private device:DeviceTypeService, private fb:FormBuilder, private topic:TopicMenuService){
    this.device.getDevice().subscribe (data => this.isMobile=data);
}

toggleState (data:number) {
  this.selectedButton=data;
  this.openFirstModal();
}

openFirstModal() {
  this.firstModal.nativeElement.classList.add('open1');
}

closeFirstModal(event?: Event) {
    this.firstModal.nativeElement.classList.remove('open1');
}


}
