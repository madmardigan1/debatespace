import { Component, OnDestroy } from '@angular/core';
import { SharedserviceService } from '../../sharedservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gpt-summary',
  templateUrl: './gpt-summary.component.html',
  styleUrls: ['./gpt-summary.component.css']
})
export class GptSummaryComponent implements OnDestroy {
  public lines: { text: string, id: number }[] = [];
  private subscription!: Subscription;

  constructor(private sharedService: SharedserviceService) {
    this.subscription = this.sharedService.changeNodeText$.subscribe(messages => {
      this.lines = messages;
    });
  }
  
  logNodeId(nodeId: number) {
    console.log(nodeId);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
