import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { MarkAsWatchedRequest, MarkAsWatchedResponse } from 'src/models/show-models/mark-as-watched.model';
import { AddVoteRequest, AddVoteResponse } from 'src/models/episode-models/add-vote.model';
import { MarkAsNotWatchedRequest, MarkAsNotWatchedResponse } from 'src/models/show-models/mark-as-not-watched.model';
import { ShowNextToWatchResponse } from 'src/models/episode-models/show-next-to-watch.model';

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
}
