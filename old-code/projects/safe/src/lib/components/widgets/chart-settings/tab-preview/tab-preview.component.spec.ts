import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabPreviewComponent } from './tab-preview.component';

describe('TabPreviewComponent', () => {
  let component: TabPreviewComponent;
  let fixture: ComponentFixture<TabPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabPreviewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
