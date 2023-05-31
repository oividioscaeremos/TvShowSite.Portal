import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { AddCommentRequest, AddCommentResponse } from 'src/models/comment-models/add-comment.model';
import { DeleteCommentResponse } from 'src/models/comment-models/delete-comment.model';
import { GetCommentsRequest, GetCommentsResponse } from 'src/models/comment-models/get-comment.model';
import { GetChildCommentsRequest, GetChildCommentsResponse } from 'src/models/comment-models/get-child-comments.model';
import { GetLatestCommentsResponse } from 'src/models/comment-models/get-latest-comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpService: HttpService) { }

  public addComment(request: AddCommentRequest) : Promise<AddCommentResponse>
  {
    return this.httpService.postWithApiUrl('comment/add_comment', request);
  }

  public getComments(request: GetCommentsRequest) : Promise<GetCommentsResponse>
  {
    console.log("ilke request", request);
    return this.httpService.postWithApiUrl('comment/get_comments', request);
  }

  public deleteComment(commentId: number) : Promise<DeleteCommentResponse>
  {
    return this.httpService.deleteWithApiUrl('comment/delete_comment', { commentId: commentId });
  }

  public getChildComments(request: GetChildCommentsRequest) : Promise<GetChildCommentsResponse>
  {
    return this.httpService.postWithApiUrl('comment/get_child_comments', request);
  }

  public getLatestComments(userId: number | null = null) : Promise<GetLatestCommentsResponse>
  {
    return this.httpService.getWithApiUrl('comment/get_latest_comments', { userId: userId });
  }
}
