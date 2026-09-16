import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/** Cloudflare Turnstile client script, rendered explicitly */
const TURNSTILE_SCRIPT_URL =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/** Cached promise of the Turnstile script loading, so it is only added once */
let turnstilePromise: Promise<any> | null = null;

/**
 * Loads the Cloudflare Turnstile client script.
 *
 * @returns The turnstile global object.
 */
const loadTurnstile = (): Promise<any> => {
  const turnstile = (window as any).turnstile;
  if (turnstile) {
    return Promise.resolve(turnstile);
  }
  if (!turnstilePromise) {
    turnstilePromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = TURNSTILE_SCRIPT_URL;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve((window as any).turnstile);
      script.onerror = (error) => {
        turnstilePromise = null;
        reject(error);
      };
      document.head.appendChild(script);
    });
  }
  return turnstilePromise;
};

/**
 * Cloudflare Turnstile captcha widget.
 * Emits the generated token, or null when the token expires or an error occurs.
 */
@Component({
  standalone: true,
  selector: 'oort-front-turnstile',
  template: `<div #container></div>`,
})
export class TurnstileComponent implements AfterViewInit, OnDestroy {
  /** Cloudflare Turnstile site key */
  @Input() siteKey!: string;
  /** Emits the captcha token, or null when it expires or fails */
  @Output() tokenChange = new EventEmitter<string | null>();
  /** Element the widget is rendered into */
  @ViewChild('container') container!: ElementRef<HTMLDivElement>;
  /** Id of the rendered widget, used to reset / remove it */
  private widgetId?: string;

  /**
   * Cloudflare Turnstile captcha widget.
   *
   * @param zone Angular zone, to bring the widget callbacks back into Angular
   * @param translate Used to display the widget in the current language
   */
  constructor(private zone: NgZone, private translate: TranslateService) {}

  ngAfterViewInit(): void {
    loadTurnstile()
      .then((turnstile) => {
        this.widgetId = turnstile.render(this.container.nativeElement, {
          sitekey: this.siteKey,
          language:
            this.translate.currentLang || this.translate.defaultLang || 'auto',
          callback: (token: string) =>
            this.zone.run(() => this.tokenChange.emit(token)),
          'expired-callback': () =>
            this.zone.run(() => this.tokenChange.emit(null)),
          'error-callback': () =>
            this.zone.run(() => this.tokenChange.emit(null)),
        });
      })
      .catch(() => this.tokenChange.emit(null));
  }

  /** Resets the widget, to generate a new token ( tokens are single-use ). */
  reset(): void {
    const turnstile = (window as any).turnstile;
    if (turnstile && this.widgetId !== undefined) {
      this.tokenChange.emit(null);
      turnstile.reset(this.widgetId);
    }
  }

  ngOnDestroy(): void {
    const turnstile = (window as any).turnstile;
    if (turnstile && this.widgetId !== undefined) {
      turnstile.remove(this.widgetId);
    }
  }
}
