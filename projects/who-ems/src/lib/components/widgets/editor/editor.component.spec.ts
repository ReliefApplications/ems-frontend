import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoEditorComponent } from './editor.component';

describe('WhoEditorComponent', () => {
  let component: WhoEditorComponent;
  let fixture: ComponentFixture<WhoEditorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WhoEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WhoEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
