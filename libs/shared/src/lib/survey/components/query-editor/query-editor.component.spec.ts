import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryEditorComponent } from './query-editor.component';

describe('QueryEditorComponent', () => {
  let component: QueryEditorComponent;
  let fixture: ComponentFixture<QueryEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QueryEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QueryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
