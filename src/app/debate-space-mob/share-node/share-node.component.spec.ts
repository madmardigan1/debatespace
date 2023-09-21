import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareNodeComponent } from './share-node.component';

describe('ShareNodeComponent', () => {
  let component: ShareNodeComponent;
  let fixture: ComponentFixture<ShareNodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareNodeComponent]
    });
    fixture = TestBed.createComponent(ShareNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
