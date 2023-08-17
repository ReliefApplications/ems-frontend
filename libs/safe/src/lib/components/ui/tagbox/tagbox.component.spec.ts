import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { SafeTagboxComponent } from './tagbox.component';
import { AutocompleteModule, IconModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

describe('SafeTagboxComponent', () => {
  let component: SafeTagboxComponent;
  let fixture: ComponentFixture<SafeTagboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SafeTagboxComponent],
      imports: [
        AutocompleteModule,
        IconModule,
        TranslateModule.forRoot(),
        TooltipModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeTagboxComponent);
    component = fixture.componentInstance;
    component.choices$ = new Observable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
