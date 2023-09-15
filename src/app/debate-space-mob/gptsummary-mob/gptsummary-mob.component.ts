import { Component, OnDestroy } from '@angular/core';
import { SharedserviceService } from '../../sharedservice.service';
import { Subscription } from 'rxjs';
import { NodeLinkService } from 'src/app/node-link.service';
import { NodeshareService } from 'src/app/nodeshare.service';
@Component({
  selector: 'app-gptsummary-mob',
  templateUrl: './gptsummary-mob.component.html',
  styleUrls: ['./gptsummary-mob.component.css']
})
export class GptsummaryMobComponent implements OnDestroy {
  
  public lines: { text: string, id: number }[] = [];
  private subscription!: Subscription;
   nextNode: any;
   previousNode: any;
   goBackone: any;
  private goBackonemore: any;
  traveled=false;

  constructor(private sharedService: SharedserviceService, private nodeLink:NodeLinkService,private nodeShare:NodeshareService) {
   
    this.subscription = this.sharedService.changeNodeText$.subscribe(messages => {
      this.lines = messages;
    });
    this.nodeShare.getEvent2().subscribe((message: { previous: string, next: string }|null) => {
      if (message) {
        this.previousNode = message.previous;
        this.nextNode = message.next;
      } else {
        // Handle the case when message is null
        this.previousNode = null;
        this.nextNode = null;
      }
    });
    
    this.nodeShare.getEvent().subscribe((message: string) => {
      this.goBackone=message;
    });

    
    

  }
  goBack () {

    this.nodeLink.goToNode(this.goBackonemore);
    this.traveled=false;
  }

  previousId ()  {
    console.log(this.previousNode);
    if (this.previousNode) {
 
      this.goBackone=this.previousNode;
      this.nodeLink.goToNode(this.previousNode);
    }
  
  }
  nextId () {
    if (this.nextNode) {
      this.goBackone=this.nextNode;
      this.nodeLink.goToNode(this.nextNode);
    }
  }
  logNodeId(nodeId: number) {
    this.goBackonemore=this.goBackone;
    this.traveled=true;
    this.nodeLink.goToNode(nodeId);
    this.goBackone=nodeId;
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
