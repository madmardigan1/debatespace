import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NodeshareService {
  private eventEmitter: EventEmitter<any> = new EventEmitter();

  emitEvent(data: any): void {
    this.eventEmitter.emit(data);
  }
  getEvent(): EventEmitter<any> {
    return this.eventEmitter;
  }

}
