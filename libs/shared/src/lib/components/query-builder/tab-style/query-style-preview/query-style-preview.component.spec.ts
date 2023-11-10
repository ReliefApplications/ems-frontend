import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryStylePreviewComponent } from './query-style-preview.component';

describe('QueryStylePreviewComponent', () => {
  let component: QueryStylePreviewComponent;
  let fixture: ComponentFixture<QueryStylePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QueryStylePreviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryStylePreviewComponent);
    component = fixture.componentInstance;
    component.style = {
      background: {
        color: '',
      },
      text: {
        color: '',
        bold: false,
        underline: false,
        italic: false,
      },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
