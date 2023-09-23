import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchMakerComponent } from './match-maker.component';

describe('MatchMakerComponent', () => {
  let component: MatchMakerComponent;
  let fixture: ComponentFixture<MatchMakerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchMakerComponent]
    });
    fixture = TestBed.createComponent(MatchMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
