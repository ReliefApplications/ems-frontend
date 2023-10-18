import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import get from 'lodash/get';
import { User } from '../../../models/user.model';
import { AppAbility } from '../../../services/auth/auth.service';
import { RestService } from '../../../services/rest/rest.service';

/**
 * User summary details component.
 */
@Component({
  selector: 'shared-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  @Input() user!: User;

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

  public form!: UntypedFormGroup;
  public attributes: { text: string; value: string }[] = [];

  /**
   * User summary details component
   *
   * @param fb Angular form builder
   * @param restService Shared rest service
   * @param ability user ability
   */
  constructor(
    private fb: UntypedFormBuilder,
    private restService: RestService,
    private ability: AppAbility
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      email: [{ value: this.user.username, disabled: true }],
    });
    this.getAttributes();
    // Disable edition if cannot see user
    if (this.ability.cannot('update', 'User')) {
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
    this.restService.get('/permissions/configuration').subscribe((config) => {
      // can user edit attributes
      const manualCreation = get(config, 'attributes.local', true);
      this.restService
        .get('/permissions/attributes')
        .subscribe((attributes: any) => {
          this.form.addControl(
            'attributes',
            this.fb.group(
              attributes.reduce(
                (group: any, attribute: any) => ({
                  ...group,
                  [attribute.value]: this.fb.control({
                    value: get(
                      this.user,
                      `attributes.${attribute.value}`,
                      null
                    ),
                    disabled: !manualCreation,
                  }),
                }),
                {}
              )
            )
          );
          this.attributes = attributes;
        });
    });
  }
}
