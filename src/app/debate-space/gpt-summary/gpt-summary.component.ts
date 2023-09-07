import { Component, OnDestroy } from '@angular/core';
import { SharedserviceService } from '../../sharedservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gpt-summary',
  templateUrl: './gpt-summary.component.html',
  styleUrls: ['./gpt-summary.component.css']
})
export class GptSummaryComponent implements OnDestroy {
  public nodeText!: string;
  private subscription!: Subscription;

  constructor(private sharedService: SharedserviceService) {
    this.subscription = this.sharedService.currentText.subscribe(text => this.nodeText = text);
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
