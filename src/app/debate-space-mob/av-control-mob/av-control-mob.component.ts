import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AvServiceService } from './av-service.service';
@Component({
  selector: 'app-av-control-mob',
  templateUrl: './av-control-mob.component.html',
  styleUrls: ['./av-control-mob.component.css']
})
export class AvControlMobComponent {
  form: FormGroup;

  constructor(private settingsService: AvServiceService, private fb: FormBuilder) {
    this.form = this.fb.group({
      pov: ['host'],
      audio: ['hearSelected']
    });
  }

  updateValue(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const zoomLevelValue = parseInt(inputElement.value, 10) / 50;
    this.settingsService.setZoomLevel(zoomLevelValue);
  }

  updatePOV(): void {
    const povValue = this.form.get('pov')?.value;
    this.settingsService.setPOV(povValue);
  }

  updateAudio(): void {
    const audioValue = this.form.get('audio')?.value;
    this.settingsService.setAudio(audioValue);
  }
}


