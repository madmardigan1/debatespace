import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeSpaceComponent } from './node-space.component';

describe('NodeSpaceComponent', () => {
  let component: NodeSpaceComponent;
  let fixture: ComponentFixture<NodeSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodeSpaceComponent]
    });
    fixture = TestBed.createComponent(NodeSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
