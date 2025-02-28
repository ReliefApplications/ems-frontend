import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Apollo } from 'apollo-angular';
import {
  AddCommentResponse,
  Comment,
  EditCommentResponse,
} from '../../../models/comments.model';
import { ADD_COMMENT, EDIT_COMMENT } from '../graphql/mutations';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonModule,
  IconModule,
  TextareaModule,
  TooltipModule,
} from '@oort-front/ui';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { DateModule } from '../../../pipes/date/date.module';

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
    TextareaModule,
    DateModule,
  ],
  selector: 'shared-comments-popup',
  templateUrl: './comments-popup.component.html',
  styleUrls: ['./comments-popup.component.scss'],
  standalone: true,
})
export class CommentsPopupComponent {
  /** Id of current record */
  @Input() recordId!: string;
  /** Currently opened question */
  @Input() selectedQuestion!: { name: string; title: string };
  /** Anchor button linked to the popup */
  @Input() button: HTMLElement | null = null;
  /** Emits to close the modal */
  @Output() closeModal = new EventEmitter();
  /** Comment control */
  public comment = new FormControl();
  /** Previous comments for target question */
  @Input() comments: { [key: string]: Comment[] } = {};

  /**
   * Comments popup window
   *
   * @param apollo apollo angular service
   */
  constructor(private apollo: Apollo) {}

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
          if (!this.comments[this.selectedQuestion.name]) {
            this.comments[this.selectedQuestion.name] = [];
          }
          this.comments[this.selectedQuestion.name].push(value.data.addComment);
          if (!this.button) {
            return;
          }
          this.button.classList.remove('resolved');
          this.button.classList.add('unresolved');
          const lastResolvedIndex = this.comments[this.selectedQuestion.name]
            .map((comment) => comment.resolved)
            .lastIndexOf(true);
          const unresolvedCount = this.comments[
            this.selectedQuestion.name
          ].slice(lastResolvedIndex + 1).length;

          this.button.textContent = `${unresolvedCount}`;
        }
      });
    this.comment.setValue('');
  }

  /** Resolves comments associated to current question */
  resolveComments() {
    this.apollo
      .mutate<EditCommentResponse>({
        mutation: EDIT_COMMENT,
        variables: {
          record: this.recordId,
          questionId: this.selectedQuestion?.name,
          resolved: true,
        },
      })
      .subscribe((value) => {
        if (!this.button) {
          return;
        }
        this.button.classList.add('resolved');
        this.button.classList.remove('unresolved');
        const editedComment = this.comments[this.selectedQuestion.name].find(
          (comment) => comment.id === value.data?.editComment.id
        );
        if (editedComment) {
          editedComment.resolved = true;
        }
        this.button.textContent = this.comments[this.selectedQuestion.name]
          ? `${this.comments[this.selectedQuestion.name].length}`
          : '+';
      });
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
