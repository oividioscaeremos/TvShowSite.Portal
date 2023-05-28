import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CommentService } from 'src/services/comment.service';
import { ErrorComponent } from '../error/error.component';
import { LoadingComponent } from '../loading/loading.component';
import { GetCommentsRequest, GetCommentsResponseEntity } from 'src/models/comment-models/get-comment.model';
import { AddCommentRequest } from 'src/models/comment-models/add-comment.model';
import { GetEmojisResponseEntity } from 'src/models/emoji-models/get-emojis.model';
import { EmojiService } from 'src/services/emoji.service';
import { AlertCloseType } from 'src/models/system-models/enums/alert-close-types.enum';
import { AlertboxComponent } from '../alertbox/alertbox.component';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @ViewChild('loading', { static: true }) loading : LoadingComponent;
  @ViewChild('error', { static: true }) error : ErrorComponent;
  
  @Input() showId: number;
  @Input() episodeId?: number;
  @Input() disabled: boolean = false;

  userProfilePictureUrl: string | null;
  comments: GetCommentsResponseEntity[] = [];
  emojis: GetEmojisResponseEntity[] = [];

  commentText: string = "";

  pageSize = 10000;
  pageIndex =  1;

  constructor(
    private commentService: CommentService,
    private emojiService: EmojiService) { }

  ngOnInit(): void {
    if(localStorage.getItem("profilePictureUrl"))
    {
      this.userProfilePictureUrl = localStorage.getItem("profilePictureUrl") as string;
    }

    this.getEmojis();
    this.getComments();
  }

  private getComments()
  {
    this.loading.show();
    this.commentService.getComments(new GetCommentsRequest(this.showId, this.pageSize, this.pageIndex, this.episodeId)).then(resp =>
    {
      if(resp.Status)
      {
        this.comments = resp.Value;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching comments."))
    .finally(() => this.loading.hide());
  }
  
  private getEmojis()
  {
    this.loading.show();
    this.emojiService.getEmojis(true).then(resp =>
    {
      if(resp.Status)
      {
        this.emojis = resp.Value;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching comment emojis."))
    .finally(() => this.loading.hide());
  }

  public addComment()
  {
    if(this.disabled) return;
    
    this.loading.show();
    this.commentService.addComment(new AddCommentRequest(this.commentText, this.showId, this.episodeId, undefined)).then(resp =>
    {
      if(resp.Status)
      {
        this.commentText = "";
        this.getComments();
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while adding a new comment."))
    .finally(() => this.loading.hide());
  }
}
