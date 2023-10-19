import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NodespaceServiceService {

  private nodeId = new BehaviorSubject<number | undefined>(1);
  private SiblingData = new BehaviorSubject<{ previous: string, next: string } | null>({ previous: '1', next: '1' });
  private nodeTextSource = new Subject<{ node: any[] }>();



  private nodeChildren = new BehaviorSubject<{ text: string, fullText: string, id: number, soundClip?: any }[]>([{ text: '', fullText: '', id: 1, soundClip: null }]);
  constructor() { }


  setNodeId(level: number | undefined): void {
    this.nodeId.next(level);
  }

  getNodeId(): Observable<number | undefined> {
    return this.nodeId.asObservable();
  }

  changeNodeText(node: any[]): void {
    this.nodeTextSource.next({node: node});
}

getNodeText(): Observable<{ node:any[] }> {
  return this.nodeTextSource.asObservable();
}


  SendAllChildren(textArray: { text: string, fullText: string, id: number, videoClip?: any, soundClip?: any }[]): void {
    this.nodeChildren.next(textArray);
  }

  getAllChildren(): Observable<{ text: string, fullText: string, id: number, videoClip?: any, soundClip?: any }[]> {  // Fixed return type to match what nodeTextSource emits
    return this.nodeChildren.asObservable();
  }
  SetSiblingData(data: any): void {

    this.SiblingData.next(data);
  }
  getSiblingData(): Observable<{ previous: string, next: string } | null> {
    return this.SiblingData.asObservable();
  }


}
