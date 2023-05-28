import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { MarkAsWatchedRequest, MarkAsWatchedResponse } from 'src/models/show-models/mark-as-watched.model';
import { AddVoteRequest, AddVoteResponse } from 'src/models/episode-models/add-vote.model';
import { MarkAsNotWatchedRequest, MarkAsNotWatchedResponse } from 'src/models/show-models/mark-as-not-watched.model';
import { ShowNextToWatchResponse } from 'src/models/episode-models/show-next-to-watch.model';
import { GetEpisodeDescriptionResponse } from 'src/models/episode-models/get-episode-description.model';
import { GetEpisodeNameResponse } from 'src/models/episode-models/get-episode-name.model';
import { GetEpisodeWatchedStatusResponse } from 'src/models/episode-models/get-episode-watched-status.model';
import { RemoveVoteRequest, RemoveVoteResponse } from 'src/models/episode-models/remove-vote.model';
import { AddEpisodeNoteRequest, AddEpisodeNoteResponse } from 'src/models/episode-models/add-episode-note.model';
import { GetEpisodeNotesResponse } from 'src/models/episode-models/get-episode-notes.model';
import { UpdateEpisodeNoteRequest, UpdateEpisodeNoteResponse } from 'src/models/episode-models/update-episode-note.model';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {

  constructor(private httpService: HttpService) { }

  public markAsWatched(request: MarkAsWatchedRequest) : Promise<MarkAsWatchedResponse>
  {
    return this.httpService.postWithApiUrl('episode/mark_as_watched', request);
  }

  public markAsNotWatched(request: MarkAsNotWatchedRequest) : Promise<MarkAsNotWatchedResponse>
  {
    return this.httpService.postWithApiUrl('episode/mark_as_not_watched', request);
  }

  public getShowNextToWatchEpisode(showId: number) : Promise<ShowNextToWatchResponse>
  {
    return this.httpService.getWithApiUrl('episode/get_show_next_to_watch', { showId: showId });
  }

  public addVote(request: AddVoteRequest) : Promise<AddVoteResponse>
  {
    return this.httpService.postWithApiUrl('episode/add_vote', request);
  }

  public removeVote(request: RemoveVoteRequest) : Promise<RemoveVoteResponse>
  {
    return this.httpService.postWithApiUrl('episode/remove_vote', request);
  }
  
  public getEpisodeDescription(episodeId: number) : Promise<GetEpisodeDescriptionResponse>
  {
    return this.httpService.getWithApiUrl('episode/get_episode_description', { episodeId: episodeId });
  }

  public getEpisodeName(episodeId: number) : Promise<GetEpisodeNameResponse>
  {
    return this.httpService.getWithApiUrl('episode/get_episode_name', { episodeId: episodeId });
  }

  public getEpisodeWatchedStatus(episodeId: number) : Promise<GetEpisodeWatchedStatusResponse>
  {
    return this.httpService.getWithApiUrl('episode/get_episode_watched_status', { episodeId: episodeId });
  }

  public getEpisodeNotes(episodeId: number) : Promise<GetEpisodeNotesResponse>
  {
    return this.httpService.getWithApiUrl('episode/get_episode_notes', { episodeId: episodeId });
  }
  
  public addEpisodeNote(request: AddEpisodeNoteRequest) : Promise<AddEpisodeNoteResponse>
  {
    return this.httpService.postWithApiUrl('episode/add_episode_note', request);
  }

  public updateEpisodeNote(request: UpdateEpisodeNoteRequest) : Promise<UpdateEpisodeNoteResponse>
  {
    return this.httpService.postWithApiUrl('episode/update_episode_note', request);
  }

  public deleteEpisodeNote(noteId: number) : Promise<GetEpisodeNotesResponse>
  {
    return this.httpService.deleteWithApiUrl('episode/delete_episode_note', { noteId: noteId });
  }
}
