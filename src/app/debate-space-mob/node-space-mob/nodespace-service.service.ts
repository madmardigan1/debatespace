import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NodespaceServiceService {

  private nodeId = new BehaviorSubject<number | undefined>(1); 
  private SiblingData = new BehaviorSubject<{ previous: string, next: string } | null>({ previous: '1', next: '1' });
  private nodeTextSource = new BehaviorSubject<{ text: string, fullText: string, id: number, soundClip?: any}[]>([{text:'', fullText: '', id:1, soundClip: null}]); // Added initial value as an empty array
  private soundClip = new BehaviorSubject<any>([]); 
  private soundArray:any = [];
  constructor() { }


  setNodeId(level: number | undefined): void {
    this.nodeId.next(level);
    
  }

  getNodeId(): Observable<number | undefined> {
    return this.nodeId.asObservable();
  }

 



  changeNodeText(textArray: { text: string, fullText:string, id: number, soundClip?: any}[]): void {
    this.nodeTextSource.next(textArray);
  }

  getNodeText(): Observable<{ text: string, fullText:string, id: number, soundClip?:any}[]> {  // Fixed return type to match what nodeTextSource emits
    return this.nodeTextSource.asObservable();
  }

  SetSiblingData(data: any): void {

    this.SiblingData.next(data);
  }

  getSiblingData(): Observable<{ previous: string, next: string } | null> {
    return this.SiblingData.asObservable();
}

sendSoundClip(level: any): void {
  this.soundArray.push(level);
  this.soundClip.next(this.soundArray);
}

getsoundClip(): Observable<string> {
  return this.soundClip.asObservable();
}
}
