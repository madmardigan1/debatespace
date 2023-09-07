import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivespaceComponent } from './activespace.component';

describe('ActivespaceComponent', () => {
  let component: ActivespaceComponent;
  let fixture: ComponentFixture<ActivespaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivespaceComponent]
    });
    fixture = TestBed.createComponent(ActivespaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
