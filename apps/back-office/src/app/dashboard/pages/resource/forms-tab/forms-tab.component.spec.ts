import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { FormsTabComponent } from './forms-tab.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { DialogModule } from '@angular/cdk/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { Resource, SkeletonTableModule } from '@oort-front/shared';
import { Router } from '@angular/router';
import { of } from 'rxjs';

const dialog = {
  open: jest.fn(() => ({ closed: of(undefined) })),
};

describe('FormsTabComponent', () => {
  let component: FormsTabComponent;
  let fixture: ComponentFixture<FormsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsTabComponent],
      imports: [
        ApolloTestingModule,
        DialogModule,
        SkeletonTableModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        TranslateService,
        { provide: Dialog, useValue: dialog },
        { provide: Router, useValue: { navigate: jest.fn() } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens the form modal scoped to the current resource', async () => {
    (component as unknown as { resource: Resource }).resource = {
      id: 'resource-id',
    } as Resource;

    await component.onAddForm();

    expect(dialog.open).toHaveBeenCalledWith(expect.any(Function), {
      data: { resourceId: 'resource-id' },
    });
  });
});
