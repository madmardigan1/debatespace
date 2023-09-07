import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GptSummaryComponent } from './gpt-summary.component';

describe('GptSummaryComponent', () => {
  let component: GptSummaryComponent;
  let fixture: ComponentFixture<GptSummaryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GptSummaryComponent]
    });
    fixture = TestBed.createComponent(GptSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
