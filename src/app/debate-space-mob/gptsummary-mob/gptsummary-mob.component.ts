import { Component, OnDestroy } from '@angular/core';
import { SharedserviceService } from '../../sharedservice.service';
import { Subscription } from 'rxjs';
import { NodeLinkService } from 'src/app/node-link.service';
@Component({
  selector: 'app-gptsummary-mob',
  templateUrl: './gptsummary-mob.component.html',
  styleUrls: ['./gptsummary-mob.component.css']
})
export class GptsummaryMobComponent implements OnDestroy {
  
  public lines: { text: string, id: number }[] = [];
  private subscription!: Subscription;

  constructor(private sharedService: SharedserviceService, private nodeLink:NodeLinkService) {
    this.subscription = this.sharedService.changeNodeText$.subscribe(messages => {
      this.lines = messages;
    });
  }
  
  logNodeId(nodeId: number) {
   
    this.nodeLink.goToNode(nodeId);
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
