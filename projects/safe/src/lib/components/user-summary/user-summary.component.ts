import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Role, User } from '../../models/user.model';

// const regions = [
//   'Asia',
//   'Africa',
//   'North America',
//   'South America',
//   'Europe',
//   'Australia',
// ];
// const countries = ['Chile'];
// const locationTypes = ['Headquarters'];
const dummyUser = {
  firstName: 'Pedro',
  lastName: 'Pascal',
  username: 'ppascal@mail.com',
  region: 'South America',
  country: 'Chile',
  locationType: 'Headquarters',
  roles: [],
};

/**
 * User Summary shared component.
 */
@Component({
  selector: 'safe-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
})
export class SafeUserSummaryComponent implements OnInit {
  @Input() public id = '';
  @Input() public roles?: Role[];
  @Input() public user: User = dummyUser;

  // public regions = regions;
  // public countries = countries;
  // public locationTypes = locationTypes;
  public form?: FormGroup;

  /**
   * User Summary shared component.
   *
   * @param fb Angular form builder
   */
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, Validators.required],
      email: [{ value: this.user.username, disabled: true }],
      // region: dummyUser.region,
      // country: dummyUser.country,
      // locationType: dummyUser.locationType,
      roles: this.user.roles,
    });
  }

  onSubmit(): void {
    console.log(this.form?.value);
  }
}
