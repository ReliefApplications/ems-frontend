import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Application } from '../../../models/application.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'safe-user-roles',
  templateUrl: './user-roles.component.html',
  styleUrls: ['./user-roles.component.scss'],
})
export class UserRolesComponent implements OnInit {
  @Input() user!: User;
  @Input() application?: Application;

  @Output() edit = new EventEmitter();

  @Input() loading = false;

  constructor() {}

  ngOnInit(): void {}
}
