import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceTypeService {

  constructor() { }

  private deviceType = new BehaviorSubject<boolean>(true); 
  private join = new Subject<number>;

  emitDevice(type:boolean) {
    this.deviceType.next(type);
  }
  getDevice() : Observable<boolean> {
    return this.deviceType.asObservable();
  }

  emitNumber(type:number) {
    this.join.next(type);
  }

  getNumber() {
    return this.join.asObservable();
  }
}
