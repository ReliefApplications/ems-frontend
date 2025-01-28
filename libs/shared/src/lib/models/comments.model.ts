import { User } from './user.model';

/** Comment model */
export interface Comment {
  id?: string;
  message?: string;
  record?: string;
  questionId?: string;
  createdBy?: User;
  createdAt?: number;
  modifiedAt?: number;
}

/** Model for comments graphql query response */
export interface CommentsQueryResponse {
  comments: Comment[];
}

/** Model for comment add mutation response*/
export interface AddCommentResponse {
  addComment: Comment;
}
