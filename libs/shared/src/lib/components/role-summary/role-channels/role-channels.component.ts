import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { get } from 'lodash';
import { Application } from '../../../models/application.model';
import { Channel, ChannelsQueryResponse } from '../../../models/channel.model';
import { Role } from '../../../models/user.model';
import { GET_CHANNELS } from '../graphql/queries';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Channels tab of Role Summary.
 */
@Component({
  selector: 'shared-role-channels',
  templateUrl: './role-channels.component.html',
  styleUrls: ['./role-channels.component.scss'],
})
export class RoleChannelsComponent implements OnInit {
  /** Role to display */
  @Input() role!: Role;
  /** Application to display */
  @Input() application?: Application;

  /** List of channels */
  public channels: Channel[] = [];
  /** List of applications */
  public applications: any[] = [];
  /** Form group */
  public form!: ReturnType<typeof this.createFormGroup>;
  /** Event emitter for edit event */
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
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Channels tab of Role Summary.
   *
   * @param fb Angular form builder
   * @param apollo Apollo client
   */
  constructor(private fb: FormBuilder, private apollo: Apollo) {}

  ngOnInit(): void {
    this.form = this.createFormGroup(this.role);
    this.apollo
      .query<ChannelsQueryResponse>({
        query: GET_CHANNELS,
        variables: {
          application: this.application?.id,
        },
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ data }) => {
        this.channels = data.channels;
        // Move channels in an array under corresponding applications.
        this.applications = Array.from(
          new Set(this.channels.map((x) => x.application?.name))
        ).map((name) => ({
          name: name ? name : 'Global',
          channels: this.channels.reduce((o: Channel[], channel: Channel) => {
            if (channel?.application?.name === name) {
              o.push(channel);
            }
            return o;
          }, []),
        }));
      });
  }

  /**
   * Create form group
   *
   * @param role Current role
   * @returns form group
   */
  private createFormGroup(role: Role) {
    return this.fb.group({
      channels: [get(role, 'channels', []).map((x) => x.id)],
    });
  }

  /**
   * Emit new role value
   */
  onUpdate(): void {
    this.edit.emit(this.form.value);
  }
}
