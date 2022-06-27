import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../models/user.model';

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

  @Output() edit = new EventEmitter();

  /**
   * User summary details component
   *
   * @param fb Angular form builder
   */
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      email: [{ value: this.user.username, disabled: true }],
    });
  }

  /**
   * Update user profile.
   */
  onUpdate(): void {
    this.edit.emit(this.form.value);
  }
}
