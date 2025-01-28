import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  AddCommentResponse,
  Comment,
  CommentsQueryResponse,
} from '../../../models/comments.model';
import { GET_COMMENTS } from '../graphql/queries';
import { ADD_COMMENT } from '../graphql/mutations';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, IconModule, TooltipModule } from '@oort-front/ui';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

/** Comment popup component */
@Component({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    IconModule,
    CommonModule,
    TooltipModule,
    TranslateModule,
    ButtonModule,
  ],
  selector: 'shared-comments-popup',
  templateUrl: './comments-popup.component.html',
  styleUrls: ['./comments-popup.component.scss'],
  standalone: true,
})
export class CommentsPopupComponent implements OnInit {
  /** Id of current record */
  @Input() recordId?: string;
  /** Currently opened question */
  @Input() selectedQuestion?: { name: string; title: string };
  /** Emits to close the modal */
  @Output() closeModal = new EventEmitter();
  /** Comment control */
  public comment = new FormControl();
  /** Previous comments for target question */
  public comments: Comment[] = [];
  // /** TinyMCE config */
  // public tinyMceConfig!: RawEditorSettings;
  // /** Dummy users, to replace */
  // users = ['Alice', 'Bob', 'Charlie', 'Dave'];

  /**
   * Comments popup window
   *
   * @param apollo apollo angular service
   */
  constructor(private apollo: Apollo) {}

  ngOnInit() {
    this.getComments();
    // this.tinyMceConfig = {
    //   plugins: 'mentions',
    //   toolbar: false,
    //   chien: {},
    //   mentions_fetch: {
    //     source: (query: any, process: any) => {
    //       const filteredUsers = this.users.filter((user) =>
    //         user.toLowerCase().startsWith(query.toLowerCase())
    //       );
    //       process(filteredUsers.map((user) => ({ id: user, name: user })));
    //     },
    //     insert: (item: { id: string; name: string }) =>
    //       `<span contenteditable="false">@${item.name}</span>`,
    //   },
    //   height: 200,
    //   menubar: false,
    //   branding: false,
    // };
  }

  /**
   * Adds a new comment for target record target question
   */
  getComments() {
    this.apollo
      .query<CommentsQueryResponse>({
        query: GET_COMMENTS,
        variables: {
          record: this.recordId,
          questionId: this.selectedQuestion?.name,
        },
      })
      .subscribe((comments) => {
        this.comments = comments.data.comments;
      });
  }

  /**
   * Adds a new comment for target record target question
   */
  addComment() {
    if (!this.comment.value) {
      //prevent adding empty comments
      return;
    }
    this.apollo
      .mutate<AddCommentResponse>({
        mutation: ADD_COMMENT,
        variables: {
          record: this.recordId,
          questionId: this.selectedQuestion?.name,
          message: this.comment.value,
        },
      })
      .subscribe((value) => {
        if (value.data?.addComment) {
          this.comments.push(value.data.addComment);
        }
      });
    this.comment.setValue('');
  }

  /**
   * Gets a display of how many time ago was the comment
   *
   * @param date Date of the comment
   * @returns a string like '3 days ago'
   */
  public getTimeAgo(date: number) {
    const seconds = Math.floor((Date.now() - date) / 1000);

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];

    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) {
        return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
      }
    }

    return 'just now';
  }
}
