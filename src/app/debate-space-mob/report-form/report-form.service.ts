import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportFormService {

  constructor() { }

  private formData = new BehaviorSubject<any>(null); 


    sendReport(value:any): void {
      this.formData.next(value);
      
    }
  
    transmitReport(): Observable<any> {
      //send to Server and notify admin *not yet implemented
      return this.formData.asObservable();
    }
}
