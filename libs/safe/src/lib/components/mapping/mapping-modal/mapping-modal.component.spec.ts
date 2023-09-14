import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeMappingModalComponent } from './mapping-modal.component';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TranslateModule } from '@ngx-translate/core';

describe('SafeMappingModalComponent', () => {
  let component: SafeMappingModalComponent;
  let fixture: ComponentFixture<SafeMappingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DIALOG_DATA, useValue: {} },
        { provide: DialogRef, useValue: { removePanelClass: jest.fn() } },
      ],
      imports: [SafeMappingModalComponent, TranslateModule.forRoot()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeMappingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
