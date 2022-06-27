import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '../../../models/user.model';

@Component({
  selector: 'safe-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  @Input() user!: User;
  public form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [{ value: this.user.firstName, required: true }],
      lastName: [{ value: this.user.lastName, required: true }],
      email: [{ value: this.user.username, disabled: true }],
    });
  }
}
