import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import get from 'lodash/get';
import { Permissions, User } from '../../../models/user.model';
import { SafeAuthService } from '../../../services/auth/auth.service';

/**
 * User summary details component.
 */
@Component({
  selector: 'safe-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  @Input() user!: User;
  public form!: FormGroup;
  public editable = false;

  @Output() edit = new EventEmitter();

  /** Setter for the loading state */
  @Input() set loading(loading: boolean) {
    if (loading) {
      this.form?.disable();
    } else {
      this.form?.enable();
      this.form?.get('email')?.disable();
    }
  }

  /** API url */
  public baseUrl: string;

  public attributes: { text: string; value: string }[] = [];

  /**
   * User summary details component
   *
   * @param environment current environment
   * @param fb Angular form builder
   * @param authService Shared authentication service
   * @param http http client
   */
  constructor(
    @Inject('environment') environment: any,
    private fb: FormBuilder,
    private authService: SafeAuthService,
    private http: HttpClient
  ) {
    this.baseUrl = environment.apiUrl + '/permissions/';
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      email: [{ value: this.user.username, disabled: true }],
    });
    this.getAttributes();
    this.editable = this.authService.userHasClaim(
      Permissions.canSeeUsers,
      true
    );
    if (!this.editable) {
      this.form.disable();
    }
  }

  /**
   * Update user profile.
   */
  onUpdate(): void {
    this.edit.emit(this.form.value);
  }

  /**
   * Get attributes from back-end, and set controls if any
   */
  private getAttributes(): void {
    const url = `${this.baseUrl}/attributes`;
    this.http.get(url).subscribe((res: any) => {
      this.form.addControl(
        'attributes',
        this.fb.group(
          res.reduce(
            (group: any, attribute: any) => ({
              ...group,
              [attribute.value]: this.fb.control(
                get(this.user, `attributes.${attribute.value}`, null)
              ),
            }),
            {}
          )
        )
      );
      this.attributes = res;
    });
  }
}
