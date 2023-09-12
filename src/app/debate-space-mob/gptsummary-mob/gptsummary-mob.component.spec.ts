import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GptsummaryMobComponent } from './gptsummary-mob.component';

describe('GptsummaryMobComponent', () => {
  let component: GptsummaryMobComponent;
  let fixture: ComponentFixture<GptsummaryMobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GptsummaryMobComponent]
    });
    fixture = TestBed.createComponent(GptsummaryMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
