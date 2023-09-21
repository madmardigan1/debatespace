import { Component , Input,Output, EventEmitter, OnInit} from '@angular/core';
import { ReportFormService } from './report-form.service';
@Component({
  selector: 'app-report-form',
  templateUrl: './report-form.component.html',
  styleUrls: ['./report-form.component.css']
})
export class ReportFormComponent implements OnInit{
  constructor (private reportServ: ReportFormService) {

  }
  ngOnInit(): void {
    this.formData.reportLink = this.getLink;
  }
  @Input() getLink = ''
  @Output() formSubmitted = new EventEmitter<void>();
  formData = {
    sexualContent: false,
    racistContent: false,
    harmContent: false,
    violenceContent: false,
    additionalDetails: '',
    reportLink: '' 
  };

  onSubmit() {
    this.formSubmitted.emit();
    this.reportServ.sendReport(this.formData);
    console.log('Form Data:', this.formData);

    // TODO: send this.formData to the server for further processing
  }
}
