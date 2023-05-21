import { Component, OnInit, ViewChild } from '@angular/core';
import { ErrorComponent } from 'src/app/components/error/error.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { MarkAsWatchedRequest } from 'src/models/show-models/mark-as-watched.model';
import { GetUserNextToWatchResponse, UserShowHomeEntity } from 'src/models/show-models/user-shows.model';
import { EpisodeService } from 'src/services/episode.service';
import { HomeService } from 'src/services/home.service';
import { ShowService } from 'src/services/show.service';

@Component({
  selector: 'app-next-to-watch-page',
  templateUrl: './next-to-watch-page.component.html',
  styleUrls: ['./next-to-watch-page.component.scss']
})
export class NextToWatchPageComponent implements OnInit {
  @ViewChild('loading', { static: true }) loading : LoadingComponent;
  @ViewChild('error', { static: true }) error : ErrorComponent;

  nextToWatchShows: UserShowHomeEntity[] = [];

  constructor(
    private episodeService: EpisodeService,
    private homeService: HomeService) { }

  ngOnInit(): void {
    this.getUserNextToWatchShows();
  }

  private getUserNextToWatchShows()
  {
    this.loading.show();
    this.homeService.getUserNextToWatch().then(resp =>
    {
      console.log("resp", resp);
      if(resp.Status)
      {
        this.nextToWatchShows = resp.Value;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching shows."))
    .finally(() => this.loading.hide());
  }

  public markAsWatched(showId: number, episodeId: number)
  {
    this.loading.show();
    this.episodeService.markAsWatched(new MarkAsWatchedRequest(showId, episodeId)).then(resp =>
    {
      if(resp.Status)
      {
        let showToUpdate = this.nextToWatchShows.find(s => s.ShowId == showId);

        if(showToUpdate)
        {
          if(resp.Value.IsFinished)
          {
            this.nextToWatchShows = this.nextToWatchShows.filter(s => s.ShowId !== showId);
          }
          else
          {
            showToUpdate.EpisodeId = resp.Value.EpisodeId;
            showToUpdate.EpisodeNumber = resp.Value.EpisodeNumber;
            showToUpdate.SeasonNumber = resp.Value.SeasonNumber;
          }
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
}
