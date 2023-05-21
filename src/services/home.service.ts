import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { GetUserNextToWatchResponse } from 'src/models/show-models/user-shows.model';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpService: HttpService) { }

  public getUserNextToWatch() : Promise<GetUserNextToWatchResponse>
  {
    return this.httpService.getWithApiUrl('home/get_user_next_to_watch', []);
  }
}
