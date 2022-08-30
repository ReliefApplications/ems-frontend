import { Component, Input, OnInit } from '@angular/core';
import { Resource } from '../../../../models/resource.model';

@Component({
  selector: 'safe-role-resource-access',
  templateUrl: './role-resource-access.component.html',
  styleUrls: ['./role-resource-access.component.scss']
})
export class RoleResourceAccessComponent implements OnInit {

  @Input() resource!: Resource;

  constructor() { }

  ngOnInit(): void {
  }

}
