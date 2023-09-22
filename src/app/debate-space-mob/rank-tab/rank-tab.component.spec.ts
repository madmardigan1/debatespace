import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankTabComponent } from './rank-tab.component';

describe('RankTabComponent', () => {
  let component: RankTabComponent;
  let fixture: ComponentFixture<RankTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RankTabComponent]
    });
    fixture = TestBed.createComponent(RankTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
