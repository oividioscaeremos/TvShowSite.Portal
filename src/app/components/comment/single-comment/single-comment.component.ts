import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { CommentComponent } from '../comment.component';
import { ErrorComponent } from '../../error/error.component';
import { LoadingComponent } from '../../loading/loading.component';
import { EmojiService } from 'src/services/emoji.service';
import { GetCommentReactionsResponseEntity } from 'src/models/emoji-models/get-comment-reactions.model';
import { AddReactionRequest } from 'src/models/emoji-models/add-reaction.model';
import { GetCommentsResponseEntity } from 'src/models/comment-models/get-comment.model';
import { CommentService } from 'src/services/comment.service';
import { GetChildCommentsRequest } from 'src/models/comment-models/get-child-comments.model';
import { AddCommentRequest } from 'src/models/comment-models/add-comment.model';

declare var $: any;

@Component({
  selector: 'app-single-comment',
  templateUrl: './single-comment.component.html',
  styleUrls: ['./single-comment.component.scss']
})
export class SingleCommentComponent implements OnInit {
  @ViewChild('loading', { static: true }) loading : LoadingComponent;
  @ViewChild('error', { static: true }) error : ErrorComponent;

  @Input() parent: CommentComponent;
  @Input() comment: GetCommentsResponseEntity;

  commentReactions: GetCommentReactionsResponseEntity[] = [];
  childComments: GetCommentsResponseEntity[] = [];

  commentText: string = "";

  constructor(
    private emojiService: EmojiService,
    private commentService: CommentService) { }

  ngOnInit(): void {
    this.getCommentReactions();
    this.getChildComments();
  }

  private getCommentReactions(showPopover?:boolean)
  {
    this.loading.show();
    this.emojiService.getCommentReactions(this.comment.Id).then(resp =>
    {
      console.log("comment reactions", resp.Value);
      if(resp.Status)
      {
        this.commentReactions = resp.Value;

        if(showPopover)
        {
          this.showEmojiPopover();
        }
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching comment reactions."))
    .finally(() => this.loading.hide());
  }

  private addReaction(emojiId: number)
  {
    this.loading.show();
    this.emojiService.addReaction(new AddReactionRequest(emojiId, this.parent.episodeId, this.comment.Id)).then(resp =>
    {
      if(resp.Status)
      {
        this.getCommentReactions(true);
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching adding the reaction."))
    .finally(() => this.loading.hide());
  }

  private getChildComments()
  {
    this.loading.show();
    this.commentService.getChildComments(new GetChildCommentsRequest(this.comment.Id)).then(resp =>
    {
      if(resp.Status)
      {
        this.childComments = resp.Value;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching child comments."))
    .finally(() => this.loading.hide());
  }

  public showEmojiPopover()
  {
    let content = this.parent.emojis.map(emoji => 
    {
      let fontColorClass;
      let commentReaction = this.commentReactions.find(reaction => reaction.EmojiId === emoji.Id);

      if(commentReaction?.IsUsersReaction)
      {
        fontColorClass = "text-warning";
      }

      return `<div class="col-3 row align-items-center justify-content-center"><i id="${emoji.Id}" class="${emoji.EmojiClass} ${fontColorClass} emoji m-2 cursor-pointer"></i><span style="font-size: 12pt;">${commentReaction?.ReactionCount ?? 0}</span></div>`;
    }).join("");

    content = `<div class="row align-items-center justify-content-between">${content}</div>`;

    $("#popoverBtn_" + this.comment.Id).popover('dispose');

    $("#popoverBtn_" + this.comment.Id).popover({
      trigger: 'focus',
      container: 'body',
      html: true,
      content: content
    });

    $("#popoverBtn_" + this.comment.Id).popover('show');

    $(".popover-body .emoji").on("click", (e: any)=> this.addReaction(e.target.id));
  }

  public addComment()
  {
    this.loading.show();
    this.commentService.addComment(new AddCommentRequest(this.commentText, this.parent.showId, this.parent.episodeId, this.comment.Id)).then(resp =>
    {
      if(resp.Status)
      {
        this.commentText = "";
        this.getChildComments();
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
