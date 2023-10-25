import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentChoiceComponent } from './content-choice.component';

describe('ContentChoiceComponent', () => {
  let component: ContentChoiceComponent;
  let fixture: ComponentFixture<ContentChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentChoiceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
