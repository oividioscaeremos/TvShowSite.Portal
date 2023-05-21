import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ShowSearchRequest, ShowSearchResponse } from 'src/models/show-models/show-search-models';
import { AddShowRequest, AddShowResponse } from 'src/models/show-models/add-show.model';
import { RemoveShowRequest, RemoveShowResponse } from 'src/models/show-models/remove-show.model';
import { GetUserNextToWatchResponse } from 'src/models/show-models/user-shows.model';

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
}
