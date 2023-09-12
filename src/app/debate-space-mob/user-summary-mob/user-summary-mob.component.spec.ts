import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSummaryMobComponent } from './user-summary-mob.component';

describe('UserSummaryMobComponent', () => {
  let component: UserSummaryMobComponent;
  let fixture: ComponentFixture<UserSummaryMobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSummaryMobComponent]
    });
    fixture = TestBed.createComponent(UserSummaryMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
