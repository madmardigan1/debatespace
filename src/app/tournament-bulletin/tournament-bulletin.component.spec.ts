import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentBulletinComponent } from './tournament-bulletin.component';

describe('TournamentBulletinComponent', () => {
  let component: TournamentBulletinComponent;
  let fixture: ComponentFixture<TournamentBulletinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TournamentBulletinComponent]
    });
    fixture = TestBed.createComponent(TournamentBulletinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
