import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NodeLinkService {
  private eventEmitter: EventEmitter<any> = new EventEmitter();

  goToNode(data: any): void {
    this.eventEmitter.emit(data);
  }

  getNodeLink(): EventEmitter<any> {
    console.log(this.eventEmitter)
    return this.eventEmitter;
  }
}
