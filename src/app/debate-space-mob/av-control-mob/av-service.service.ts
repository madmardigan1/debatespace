import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
 
@Injectable({
  providedIn: 'root'
})
export class AvServiceService {
  private zoomLevel = new BehaviorSubject<number>(0);  // default value
  private view = new BehaviorSubject<string>('curtailed');  // default value
  private pov = new BehaviorSubject<string>('host');  // default value
  private audio = new BehaviorSubject<string>('hearSelected');  // default value

  constructor() { }
  // Zoom Level
  setZoomLevel(level: number): void {
    this.zoomLevel.next(level);
    console.log(this.zoomLevel.value);
  }

  getZoomLevel(): Observable<number> {
    return this.zoomLevel.asObservable();
  }

  setView(povValue: string): void {
    if (['curtailed', 'detailed'].includes(povValue)) {
      this.pov.next(povValue);
      console.log(this.pov.value);
    }
  }

  getView(): Observable<string> {
    return this.pov.asObservable();
  }
  // POV
  setPOV(povValue: string): void {
    if (['host', 'user'].includes(povValue)) {
      this.pov.next(povValue);
      console.log(this.pov.value);
    }
  }

  getPOV(): Observable<string> {
    return this.pov.asObservable();
  }

  // Audio
  setAudio(audioValue: string): void {
    if (['hearSelected', 'hearAll'].includes(audioValue)) {
      this.audio.next(audioValue);
      console.log(this.audio.value);
    }
  }

  getAudio(): Observable<string> {
    return this.audio.asObservable();
  }
}
