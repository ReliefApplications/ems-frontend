import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipDirective } from '@oort-front/ui';
import { FileService } from '../../../services/file/file.service';
import { FileDownloadButtonComponent } from './file-download-button.component';

describe('FileDownloadButtonComponent', () => {
  let fixture: ComponentFixture<FileDownloadButtonComponent>;
  let component: FileDownloadButtonComponent;
  let fileService: Pick<FileService, 'download'>;
  const file = {
    name: 'identity-document.png',
    type: 'image/png',
    content: 'stored-file-id',
  };

  beforeEach(async () => {
    fileService = { download: jest.fn() };
    await TestBed.configureTestingModule({
      imports: [FileDownloadButtonComponent, TranslateModule.forRoot()],
      providers: [{ provide: FileService, useValue: fileService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FileDownloadButtonComponent);
    component = fixture.componentInstance;
    component.file = file;
    fixture.detectChanges();
  });

  it('downloads the file when clicked', () => {
    const button = fixture.nativeElement.querySelector(
      'button'
    ) as HTMLButtonElement;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });

    button.dispatchEvent(event);

    expect(fileService.download).toHaveBeenCalledWith(file);
    expect(event.defaultPrevented).toBe(true);
  });

  it('describes the download in a tooltip', () => {
    const tooltip = fixture.debugElement
      .query(By.directive(TooltipDirective))
      .injector.get(TooltipDirective);

    // No translation loader in tests: the key is returned as is
    expect(tooltip.uiTooltip).toBe('common.downloadObject');
    expect(tooltip.uiTooltipPosition).toBe('top');
  });

  it('does nothing when no file is set', () => {
    component.file = undefined;
    fixture.detectChanges();

    (
      fixture.nativeElement.querySelector('button') as HTMLButtonElement
    ).click();

    expect(fileService.download).not.toHaveBeenCalled();
  });
});
