import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertboxComponent } from 'src/app/components/alertbox/alertbox.component';
import { ErrorComponent } from 'src/app/components/error/error.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { GetCommentsRequest, GetCommentsResponseEntity } from 'src/models/comment-models/get-comment.model';
import { AddReactionRequest } from 'src/models/emoji-models/add-reaction.model';
import { GetEmojisResponseEntity } from 'src/models/emoji-models/get-emojis.model';
import { GetEpisodeReactionsResponseEntity } from 'src/models/emoji-models/get-episode-reactions.model';
import { RemoveReactionRequest } from 'src/models/emoji-models/remove-reaction.model';
import { AddEpisodeNoteRequest } from 'src/models/episode-models/add-episode-note.model';
import { AddVoteRequest } from 'src/models/episode-models/add-vote.model';
import { GetEpisodeNotesResponseEntity } from 'src/models/episode-models/get-episode-notes.model';
import { RemoveVoteRequest } from 'src/models/episode-models/remove-vote.model';
import { UpdateEpisodeNoteRequest } from 'src/models/episode-models/update-episode-note.model';
import { FavoriteCharactersResponseEntity } from 'src/models/show-models/favorite-characters.model';
import { MarkAsNotWatchedRequest } from 'src/models/show-models/mark-as-not-watched.model';
import { MarkAsWatchedRequest } from 'src/models/show-models/mark-as-watched.model';
import { AlertCloseType } from 'src/models/system-models/enums/alert-close-types.enum';
import { CommentService } from 'src/services/comment.service';
import { EmojiService } from 'src/services/emoji.service';
import { EpisodeService } from 'src/services/episode.service';
import { ShowService } from 'src/services/show.service';

declare var $: any;

@Component({
  selector: 'app-episode',
  templateUrl: './episode.component.html',
  styleUrls: ['./episode.component.scss']
})
export class EpisodeComponent implements OnInit {
  @ViewChild('loading', { static: true }) loading : LoadingComponent;
  @ViewChild('error', { static: true }) error : ErrorComponent;
  @ViewChild('alertBox', { static: true }) alertBox : AlertboxComponent;

  showId: number;
  episodeId: number;

  pageSize = 10000;
  pageIndex = 1;
  showTheRest: boolean = true;
  noteContent: string = "";

  posterURL: string = "";
  episodeName: string = "";
  isWatched: boolean = false;
  episodeDescription: string = "";
  comments: GetCommentsResponseEntity[] = [];
  emojis: GetEmojisResponseEntity[] = [];
  episodeReactions: GetEpisodeReactionsResponseEntity[] = [];
  favoriteCharacters: FavoriteCharactersResponseEntity[] = [];
  episodeNotes: GetEpisodeNotesResponseEntity[] = [];
  showName: string = "";

  noteToDelete: GetEpisodeNotesResponseEntity | undefined;
  noteToUpdate: GetEpisodeNotesResponseEntity | undefined;

  alertFlags = {
    isDeletingNote: false
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commentService: CommentService,
    private emojiService: EmojiService,
    private episodeService: EpisodeService,
    private showService: ShowService
  ) { }

  ngOnInit(): void
  {
    this.route.paramMap.subscribe(params => 
    {
      let showId = params.get('showId');
      let episodeId = params.get('episodeId');

      if(showId && episodeId)
      {
        this.showId = parseInt(showId);
        this.episodeId = parseInt(episodeId);

        this.getShowPoster();
        this.getShowName();
        this.getEpisodeName();
        this.getEpisodeWatchedStatus();
      }
      else
      {
        this.router.navigateByUrl('/');
      }
    });
  }

  public initializeTheRest()
  {
    this.showTheRest = true;

    this.getEpisodeDescription();
    this.getComments();
    this.getEmojis();
    this.getFavoriteCharacters();
    this.getEpisodeNotes();
  }

  public markEpisodeAsWatched()
  {
    this.loading.show();
    this.episodeService.markAsWatched(new MarkAsWatchedRequest(this.showId, this.episodeId)).then(resp =>
    {
      if(resp.Status)
      {
        this.isWatched = true;

        if(this.showTheRest === false)
        {
          this.initializeTheRest();
        }
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while marking the episode as watched."))
    .finally(() => this.loading.hide());
  }

  public markEpisodeAsNotWatched()
  {
    this.loading.show();
    this.episodeService.markAsNotWatched(new MarkAsNotWatchedRequest(this.showId, this.episodeId)).then(resp =>
    {
      if(resp.Status)
      {
        this.isWatched = false;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while marking the episode as not watched."))
    .finally(() => this.loading.hide());
  }

  public addVote(characterId: number)
  {
    if(!this.isWatched) return;

    let lastVotedCharacter = this.favoriteCharacters.find(f => f.IsUsersVote === true);

    this.loading.show();
    this.episodeService.addVote(new AddVoteRequest(this.episodeId, characterId)).then(resp =>
    {
      if(resp.Status)
      {
        let favoriteCharacter = this.favoriteCharacters.find(favoriteCharacter => favoriteCharacter.CharacterId === characterId);

        if(favoriteCharacter)
        {
          favoriteCharacter.VoteCount++;
          favoriteCharacter.IsUsersVote = true;
        }

        if(lastVotedCharacter)
        {
          lastVotedCharacter.VoteCount--;
          lastVotedCharacter.IsUsersVote = false;
        }

        this.sortFavoriteCharacters();
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while registering the vote."))
    .finally(() => this.loading.hide());
  }

  public removeVote(characterId: number)
  {
    if(!this.isWatched) return;

    this.loading.show();
    this.episodeService.removeVote(new RemoveVoteRequest(this.episodeId)).then(resp =>
    {
      if(resp.Status)
      {
        this.favoriteCharacters.forEach(c =>
        {
          c.IsUsersVote = false;

          if(c.CharacterId === characterId)
          {
            c.VoteCount--;
          }
        });

        this.sortFavoriteCharacters();
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while removing the vote."))
    .finally(() => this.loading.hide());
  }

  public addReaction(emojiId: number)
  {
    if(!this.isWatched) return;

    let lastReaction = this.episodeReactions.find(reaction => reaction.IsUsersReaction === true);
    this.loading.show();
    this.emojiService.addReaction(new AddReactionRequest(emojiId, this.episodeId)).then(resp =>
    {
      if(resp.Status)
      {
        let currentReaction = this.episodeReactions.find(reaction => reaction.EmojiId === emojiId);

        if(currentReaction)
        {
          currentReaction.IsUsersReaction = true;
          currentReaction.ReactionCount++;
        }

        if(lastReaction)
        {
          lastReaction.IsUsersReaction = false;
          lastReaction.ReactionCount--;
        }
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while adding the reaction."))
    .finally(() => this.loading.hide());
  }

  public removeReaction(emojiId: number)
  {
    if(!this.isWatched) return;

    this.loading.show();
    this.emojiService.removeReaction(new RemoveReactionRequest(emojiId, this.episodeId)).then(resp =>
    {
      if(resp.Status)
      {
        let currentReaction = this.episodeReactions.find(reaction => reaction.EmojiId === emojiId);

        if(currentReaction)
        {
          currentReaction.IsUsersReaction = false;
          currentReaction.ReactionCount--;
        }
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while removing the reaction."))
    .finally(() => this.loading.hide());
  }

  public addNewNote()
  {
    if(!this.isWatched) return;

    this.loading.show();
    this.episodeService.addEpisodeNote(new AddEpisodeNoteRequest(this.episodeId, this.noteContent)).then(resp =>
    {
      console.log("resp", resp);

      try
      {
        if(resp.Status)
        {
          this.episodeNotes.push(resp.Value);
          this.noteContent = "";
        }
        else
        {
          this.error.addAlerts(resp.ErrorList);
        }
      }
      catch(err)
      {
        console.log("ERR", err);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while adding a new note."))
    .finally(() => this.loading.hide());
  }

  public deleteNoteBtnClick(note: GetEpisodeNotesResponseEntity)
  {
    this.noteToDelete = note;
    this.alertFlags.isDeletingNote = true;

    this.alertBox.addAlert("Note will be irreversibly deleted, do you confirm?", {
      IsConfirmButtonVisible: true
    });
  }

  public editNoteBtnClick(note: GetEpisodeNotesResponseEntity)
  {
    this.noteToUpdate = Object.assign({}, note);

    $('#collapse'+ note.Id).collapse('show');
  }

  public cancelEditNoteBtnClick()
  {
    this.noteToUpdate = undefined;
  }

  public editNote()
  {
    this.loading.show();
    this.episodeService.updateEpisodeNote(new UpdateEpisodeNoteRequest(this.noteToUpdate!.Id, this.noteToUpdate!.Content)).then(resp =>
    {
      if(resp.Status)
      {
        let episodeNote = this.episodeNotes.find(note => note.Id === this.noteToUpdate!.Id);

        if(episodeNote)
        {
          episodeNote.Content = this.noteToUpdate!.Content;
        }

        this.noteToUpdate = undefined;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while updating the note."))
    .finally(() => this.loading.hide());
  }

  public alertBoxClosed(alertCloseType: AlertCloseType)
  {
    if(alertCloseType === AlertCloseType.Confirm)
    {
      if(this.alertFlags.isDeletingNote)
      {
        this.deleteNote();
      }
    }

    this.alertFlags.isDeletingNote = false;
  }

  private getShowPoster()
  {
    this.loading.show();
    this.showService.getShowPosterURL(this.showId).then(resp =>
    {
      if(resp.Status)
      {
        this.posterURL = resp.Value;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching poster."))
    .finally(() => this.loading.hide());
  }

  private getEpisodeName()
  {
    this.loading.show();
    this.episodeService.getEpisodeName(this.episodeId).then(resp =>
    {
      if(resp.Status)
      {
        this.episodeName = resp.Value;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching episode name."))
    .finally(() => this.loading.hide());
  }

  private getEpisodeWatchedStatus()
  {
    this.loading.show();
    this.episodeService.getEpisodeWatchedStatus(this.episodeId).then(resp =>
    {
      if(resp.Status)
      {
        this.isWatched = resp.Value;
        this.showTheRest = resp.Value;

        if(resp.Value)
        {
          this.initializeTheRest();
        }
        else
        {
          setTimeout(() =>
          {
            let showTheRestContainer = (document.getElementById("showTheRestContainer") as HTMLElement);

            if(showTheRestContainer)
            {
              let minHeight = window.innerHeight - showTheRestContainer.offsetTop;
  
              showTheRestContainer.style.minHeight = minHeight + "px";
              showTheRestContainer.classList.add("d-flex", "flex-column", "align-items-center", "justify-content-center");
            }
          });
        }
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch((err) => this.error.addAlert("Something unexpected happened while fetching episode watch status." + JSON.stringify(err)))
    .finally(() => this.loading.hide());
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
    this.emojiService.getEmojis(false).then(resp =>
    {
      if(resp.Status)
      {
        this.emojis = resp.Value;

        this.getEpisodeReactions();
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching emojis."))
    .finally(() => this.loading.hide());
  }

  private getEpisodeReactions()
  {
    this.loading.show();
    this.emojiService.getEpisodeReactions(this.episodeId).then(resp =>
    {
      if(resp.Status)
      {
        this.episodeReactions = this.emojis.map(emoji =>
        {
          let episodeReaction = new GetEpisodeReactionsResponseEntity();
          episodeReaction.EmojiId = emoji.Id;
          episodeReaction.ReactionCount = resp.Value.find(reaction => reaction.EmojiId === emoji.Id)?.ReactionCount ?? 0;
          episodeReaction.IsUsersReaction = resp.Value.find(reaction => reaction.EmojiId === emoji.Id)?.IsUsersReaction ?? false;
          episodeReaction.EmojiClassName = emoji.EmojiClass;
          episodeReaction.EmojiName = emoji.EmojiName;

          return episodeReaction;
        });
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching episode reactions."))
    .finally(() => this.loading.hide());
  }

  private getEpisodeDescription()
  {
    this.loading.show();
    this.episodeService.getEpisodeDescription(this.episodeId).then(resp =>
    {
      if(resp.Status)
      {
        this.episodeDescription = resp.Value;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching episode description."))
    .finally(() => this.loading.hide());
  }

  private getFavoriteCharacters()
  {
    this.loading.show();
    this.showService.getFavoriteCharacters(this.showId, this.episodeId).then(resp =>
    {
      if(resp.Status)
      {
        this.favoriteCharacters = resp.Value;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching favorite episode characters."))
    .finally(() => this.loading.hide());
  }

  private getEpisodeNotes()
  {
    this.loading.show();
    this.episodeService.getEpisodeNotes(this.episodeId).then(resp =>
    {
      if(resp.Status)
      {
        this.episodeNotes = resp.Value;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching favorite episode characters."))
    .finally(() => this.loading.hide());
  }
  
  private deleteNote()
  {
    this.loading.show();
    this.episodeService.deleteEpisodeNote(this.noteToDelete!.Id).then(resp =>
    {
      if(resp.Status)
      {
        this.episodeNotes = this.episodeNotes.filter(note => note.Id !== this.noteToDelete!.Id);

        this.noteToDelete = undefined;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching favorite episode characters."))
    .finally(() => this.loading.hide());
  }

  private getShowName()
  {
    this.loading.show();
    this.showService.getShowName(this.showId).then(resp =>
    {
      if(resp.Status)
      {
        this.showName = resp.Value;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching show name."))
    .finally(() => this.loading.hide());
  }

  private sortFavoriteCharacters()
  {
    this.favoriteCharacters.sort((a, b) => b.VoteCount - a.VoteCount);
  }
}
