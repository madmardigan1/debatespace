import { Component, OnDestroy } from '@angular/core';
import { SharedserviceService } from '../../sharedservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gptsummary-mob',
  templateUrl: './gptsummary-mob.component.html',
  styleUrls: ['./gptsummary-mob.component.css']
})
export class GptsummaryMobComponent {

  
    public nodeText!: string;
    private subscription!: Subscription;
  
    constructor(private sharedService: SharedserviceService) {
      this.subscription = this.sharedService.currentText.subscribe(text => this.nodeText = text);
    }
    
    ngOnDestroy() {
      this.subscription.unsubscribe();
    }
  }

