import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutNodesComponent } from './about-nodes.component';

describe('AboutNodesComponent', () => {
  let component: AboutNodesComponent;
  let fixture: ComponentFixture<AboutNodesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutNodesComponent]
    });
    fixture = TestBed.createComponent(AboutNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
