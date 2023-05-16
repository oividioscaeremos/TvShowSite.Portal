import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { ShowSearchRequest, ShowSearchResponse } from 'src/models/show-models/show-search-models';

@Injectable({
  providedIn: 'root'
})
export class ShowService {

  constructor(private httpService: HttpService) { }

  public search(request: ShowSearchRequest) : Promise<ShowSearchResponse>
  {
    return this.httpService.postWithApiUrl('show/search', request);
  }
}
