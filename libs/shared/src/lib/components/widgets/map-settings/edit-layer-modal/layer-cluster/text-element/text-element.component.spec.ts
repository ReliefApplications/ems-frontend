import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextElementComponent } from './text-element.component';

describe('TextElementComponent', () => {
  let component: TextElementComponent;
  let fixture: ComponentFixture<TextElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextElementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TextElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
