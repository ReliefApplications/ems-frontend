import { Component, Input, OnInit } from '@angular/core';
import { Application } from '../../../../models/application.model';

/** Auto role assignment section component of Role Summary. */
@Component({
  selector: 'safe-auto-role-assignment',
  templateUrl: './auto-role-assignment.component.html',
  styleUrls: ['./auto-role-assignment.component.scss'],
})
export class AutoRoleAssignmentComponent implements OnInit {
  @Input() application!: Application;

  ngOnInit(): void {}
}
