import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { DeviceTypeService } from './device-type.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  title = 'debatespaces';
  isMobile = false;

  @ViewChild('screen') screen!: ElementRef;
  @ViewChild('banner') banner!: ElementRef;


  constructor(private deviceType: DeviceTypeService) {}
  ngAfterViewInit(): void {
    this.toggleMode();
  }

  matchmaker(type: number) {
    this.deviceType.emitNumber(type);
  }

  toggleMode() {
    this.isMobile = !this.isMobile;
    if (this.isMobile) {
      this.banner.nativeElement.classList.add('mobile');
      this.banner.nativeElement.classList.remove('banner');
      this.screen.nativeElement.classList.add('mobile');
      this.screen.nativeElement.classList.remove('desktop');
    }
    else {
      this.banner.nativeElement.classList.remove('mobile');
      this.banner.nativeElement.classList.add('banner');
      this.screen.nativeElement.classList.add('desktop');
      this.screen.nativeElement.classList.remove('mobile');
    }
    this.deviceType.emitDevice(this.isMobile);
  }
}



