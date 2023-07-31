import { Component } from '@angular/core';
import { SharedserviceService } from '../sharedservice.service';
@Component({
  selector: 'app-gpt-summary',
  templateUrl: './gpt-summary.component.html',
  styleUrls: ['./gpt-summary.component.css']
})
export class GptSummaryComponent {
  public nodeText!: string;

  constructor(private sharedService: SharedserviceService) {
    this.sharedService.currentText.subscribe(text => this.nodeText = text)
  }
  
  
}
