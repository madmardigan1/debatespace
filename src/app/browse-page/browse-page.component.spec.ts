import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsePageComponent } from './browse-page.component';

describe('BrowsePageComponent', () => {
  let component: BrowsePageComponent;
  let fixture: ComponentFixture<BrowsePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BrowsePageComponent]
    });
    fixture = TestBed.createComponent(BrowsePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
