import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeSpaceMobComponent } from './node-space-mob.component';

describe('NodeSpaceMobComponent', () => {
  let component: NodeSpaceMobComponent;
  let fixture: ComponentFixture<NodeSpaceMobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodeSpaceMobComponent]
    });
    fixture = TestBed.createComponent(NodeSpaceMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
