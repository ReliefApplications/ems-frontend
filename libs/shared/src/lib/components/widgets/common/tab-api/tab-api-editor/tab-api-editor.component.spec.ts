import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabApiEditorComponent } from './tab-api-editor.component';

describe('TabApiEditorComponent', () => {
  let component: TabApiEditorComponent;
  let fixture: ComponentFixture<TabApiEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabApiEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TabApiEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
