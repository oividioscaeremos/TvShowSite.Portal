import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { MarkAsWatchedRequest, MarkAsWatchedResponse } from 'src/models/show-models/mark-as-watched.model';

@Injectable({
  providedIn: 'root'
})
export class EpisodeService {

  constructor(private httpService: HttpService) { }

  public markAsWatched(request: MarkAsWatchedRequest) : Promise<MarkAsWatchedResponse>
  {
    return this.httpService.postWithApiUrl('episode/mark_as_watched', request);
  }

  public getShowNextToWatchEpisode(showId: number) : Promise<MarkAsWatchedResponse>
  {
    return this.httpService.getWithApiUrl('episode/get_show_next_to_watch', { showId: showId });
  }
}
