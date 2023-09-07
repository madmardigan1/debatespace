import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpacecreateComponent } from './spacecreate.component';

describe('SpacecreateComponent', () => {
  let component: SpacecreateComponent;
  let fixture: ComponentFixture<SpacecreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpacecreateComponent]
    });
    fixture = TestBed.createComponent(SpacecreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
