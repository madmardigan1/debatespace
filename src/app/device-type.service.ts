import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceTypeService {

  constructor() { }

  private deviceType = new BehaviorSubject<boolean>(true); 


  emitDevice(type:boolean) {
    this.deviceType.next(type);
  }
  getDevice() : Observable<boolean> {
    return this.deviceType.asObservable();
  }
}
