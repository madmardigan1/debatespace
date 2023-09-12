import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvControlMobComponent } from './av-control-mob.component';

describe('AvControlMobComponent', () => {
  let component: AvControlMobComponent;
  let fixture: ComponentFixture<AvControlMobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvControlMobComponent]
    });
    fixture = TestBed.createComponent(AvControlMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
