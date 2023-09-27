import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronEditorComponent } from './cron-editor.component';

describe('CronEditorComponent', () => {
  let component: CronEditorComponent;
  let fixture: ComponentFixture<CronEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CronEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CronEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
