import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ShowSearchRequest, ShowSearchResponse } from 'src/models/show-models/show-search-models';
import { AddShowRequest, AddShowResponse } from 'src/models/show-models/add-show.model';
import { RemoveShowRequest, RemoveShowResponse } from 'src/models/show-models/remove-show.model';
import { ShowDescriptionSearchResponse } from 'src/models/show-models/show-description.model';
import { ShowNameResponse } from 'src/models/show-models/show-name.model';
import { GetPosterURLResponse } from 'src/models/show-models/poster-url.model';
import { FavoriteCharactersResponse } from 'src/models/show-models/favorite-characters.model';
import { SeasonEpisodeResponse } from 'src/models/show-models/season-episode.model';

@Injectable({
  providedIn: 'root'
})
export class ShowService {

  constructor(private httpService: HttpService) { }

  public search(request: ShowSearchRequest) : Promise<ShowSearchResponse>
  {
    return this.httpService.postWithApiUrl('show/search', request);
  }

  public addShow(request: AddShowRequest) : Promise<AddShowResponse>
  {
    return this.httpService.postWithApiUrl('show/add', request);
  }

  public removeShow(request: RemoveShowRequest) : Promise<RemoveShowResponse>
  {
    return this.httpService.postWithApiUrl('show/remove', request);
  }

  public getShowDescription(showId: number) : Promise<ShowDescriptionSearchResponse>
  {
    return this.httpService.getWithApiUrl('show/get_description', { showId: showId });
  }

  public getFavoriteCharacters(showId: number, episodeId?: number) : Promise<FavoriteCharactersResponse>
  {
    return this.httpService.getWithApiUrl('show/get_favorite_characters', { showId: showId, episodeId: episodeId });
  }

  public getShowName(showId: number) : Promise<ShowNameResponse>
  {
    return this.httpService.getWithApiUrl('show/get_name', { showId: showId });
  }

  public getShowPosterURL(showId: number) : Promise<GetPosterURLResponse>
  {
    return this.httpService.getWithApiUrl('show/get_poster', { showId: showId });
  }

  public getShowSeasonsEpisodes(showId: number) : Promise<SeasonEpisodeResponse>
  {
    return this.httpService.getWithApiUrl('show/get_seasons_episodes', { showId: showId });
  }
}
