import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsolatedHtmlComponent } from './isolated-html.component';

describe('IsolatedHtmlComponent', () => {
  let component: IsolatedHtmlComponent;
  let fixture: ComponentFixture<IsolatedHtmlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IsolatedHtmlComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(IsolatedHtmlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
