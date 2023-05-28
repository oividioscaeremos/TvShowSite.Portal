import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorComponent } from 'src/app/components/error/error.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { AddShowRequest } from 'src/models/show-models/add-show.model';
import { FavoriteCharactersResponseEntity } from 'src/models/show-models/favorite-characters.model';
import { MarkAsNotWatchedRequest } from 'src/models/show-models/mark-as-not-watched.model';
import { MarkAsWatchedRequest } from 'src/models/show-models/mark-as-watched.model';
import { RemoveShowRequest } from 'src/models/show-models/remove-show.model';
import { SeasonEpisodeEpisode, SeasonEpisodeResponse, SeasonEpisodeResponseEntity, SeasonEpisodeSeason } from 'src/models/show-models/season-episode.model';
import { EpisodeService } from 'src/services/episode.service';
import { ShowService } from 'src/services/show.service';

@Component({
  selector: 'app-show-page',
  templateUrl: './show-page.component.html',
  styleUrls: ['./show-page.component.scss']
})
export class ShowPageComponent implements OnInit {
  @ViewChild('loading', { static: true }) loading : LoadingComponent;
  @ViewChild('error', { static: true }) error : ErrorComponent;

  showId: number;
  showName: string = "";
  posterURL: string = "";
  showDescription: string = "";

  selectedSeasonId: number;
  isShowAdded: boolean = false;

  seasonsEpisodes: SeasonEpisodeResponseEntity[] = [];
  seasons: SeasonEpisodeSeason[] = [];
  episodes: SeasonEpisodeEpisode[] = [];

  favoriteCharacters: FavoriteCharactersResponseEntity[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showService: ShowService,
    private episodeService: EpisodeService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => 
    {
      try
      {
        if(params.has("id"))
        {
          this.showId = parseInt(params.get("id") as string);

          this.getShowName();
          this.getUserShowStatus();
          this.getShowPosterURL();
          this.getShowDescription();
          this.getFavoriteCharacters();
          this.getShowSeasonsEpisodes();
        }
        else
        {
          this.router.navigateByUrl("/");
        }
      }
      catch
      {
        this.router.navigateByUrl("/");
      }
    });
  }

  private getShowDescription()
  {
    this.loading.show();
    this.showService.getShowDescription(this.showId).then(resp =>
    {
      if(resp.Status)
      {
        this.showDescription = resp.Value;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching show description."))
    .finally(() => this.loading.hide());
  }

  private getShowPosterURL()
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
    .catch(() => this.error.addAlert("Something unexpected happened while fetching show poster."))
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

  private getFavoriteCharacters()
  {
    this.loading.show();
    this.showService.getFavoriteCharacters(this.showId).then(resp =>
    {
      if(resp.Status)
      {
        this.favoriteCharacters = resp.Value;
        console.log("ilker fav char", resp);
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching show name."))
    .finally(() => this.loading.hide());
  }

  private getShowSeasonsEpisodes()
  {
    this.loading.show();
    this.showService.getShowSeasonsEpisodes(this.showId).then(resp =>
    {
      if(resp.Status)
      {
        this.seasonsEpisodes = resp.Value;

        if(resp.Value?.length > 0)
        {
          let seasonIds: Array<number> = [];

          for(let i = 0; i < resp.Value.length; i++)
          {
            let entity = resp.Value[i] as SeasonEpisodeResponseEntity;

            if(seasonIds.indexOf(entity.SeasonId) === -1)
            {
              let season = new SeasonEpisodeSeason();
              let episode = new SeasonEpisodeEpisode();

              season.SeasonId = entity.SeasonId;
              season.SeasonName = entity.SeasonName;
              season.Episodes = [];

              episode.EpisodeId = entity.EpisodeId;
              episode.EpisodeName = entity.EpisodeName;
              episode.EpisodeNumber = entity.EpisodeNumber;
              episode.SeasonId = entity.SeasonId;
              episode.IsWatched = entity.IsWatched;

              season.Episodes.push(episode);

              this.seasons.push(season);

              seasonIds.push(entity.SeasonId);
            }
            else
            {
              let episode = new SeasonEpisodeEpisode();
              episode.EpisodeId = entity.EpisodeId;
              episode.EpisodeName = entity.EpisodeName;
              episode.EpisodeNumber = entity.EpisodeNumber;
              episode.SeasonId = entity.SeasonId;
              episode.IsWatched = entity.IsWatched;

              let season = this.seasons.find(s => s.SeasonId === entity.SeasonId);

              if(season)
              {
                season.Episodes.push(episode);
              }
            }
          }

          this.getShowNextToWatch();
          console.log("this.seasons", this.seasons);
        }
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching show seasons and episodes."))
    .finally(() => this.loading.hide());
  }

  private getShowNextToWatch()
  {
    this.loading.show();
    this.episodeService.getShowNextToWatchEpisode(this.showId).then(resp =>
    {
      if(resp.Status)
      {
        let season = this.seasons.find(s => s.SeasonId === resp.Value.SeasonId);

        if(season)
        {
          this.episodes = season.Episodes;
          this.selectedSeasonId = season.SeasonId;
        }
      }
      else
      {
        this.error.addAlerts(resp.Status);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching next episode to watch."))
    .finally(() => this.loading.hide());
  }

  private getUserShowStatus()
  {
    this.loading.show();
    this.showService.getUserShowStatus(this.showId).then(resp =>
    {
      if(resp.Status)
      {
        this.isShowAdded = resp.Value;
      }
      else
      {
        this.error.addAlerts(resp.Status);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching user show status."))
    .finally(() => this.loading.hide());
  }

  public seasonSelectionChanged(event: any)
  {
    let selectedSeasonId = event.target.value;
    
    let season = this.seasons.find(s => s.SeasonId == selectedSeasonId);

    if(season)
    {
      this.episodes = season.Episodes;
      this.selectedSeasonId = season.SeasonId;
    }
  }

  public markEpisodeAsWatched(seasonId: number, episodeId: number)
  {
    this.loading.show();
    this.episodeService.markAsWatched(new MarkAsWatchedRequest(this.showId, episodeId)).then(resp =>
    {
      if(resp.Status)
      {
        let season = this.seasons.find(s => s.SeasonId === seasonId);

        if(season)
        {
          let episode = season.Episodes.find(e => e.EpisodeId === episodeId);

          if(episode)
          {
            episode.IsWatched = true;
          }
        }

        if(!resp.Value.IsFinished)
        {
          this.selectedSeasonId = resp.Value.SeasonId;

          let nextToWatchSeason = this.seasons.find(s => s.SeasonId === resp.Value.SeasonId);

          if(nextToWatchSeason)
          {
            this.episodes = nextToWatchSeason.Episodes;
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

  public markEpisodeAsNotWatched(seasonId: number, episodeId: number)
  {
    this.loading.show();
    this.episodeService.markAsNotWatched(new MarkAsNotWatchedRequest(this.showId, episodeId)).then(resp =>
    {
      if(resp.Status)
      {
        let season = this.seasons.find(s => s.SeasonId === seasonId);

        if(season)
        {
          let episode = season.Episodes.find(e => e.EpisodeId === episodeId);

          if(episode)
          {
            episode.IsWatched = false;
          }
        }

        if(!resp.Value.IsFinished)
        {
          this.selectedSeasonId = resp.Value.SeasonId;

          let nextToWatchSeason = this.seasons.find(s => s.SeasonId === resp.Value.SeasonId);

          if(nextToWatchSeason)
          {
            this.episodes = nextToWatchSeason.Episodes;
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

  public addShow()
  {
    this.loading.show();
    this.showService.addShow(new AddShowRequest(this.showId, -1, true)).then(resp =>
    {
      if(resp.Status)
      {
        this.isShowAdded = true;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while adding the show."))
    .finally(() => this.loading.hide());
  }

  public removeShow()
  {
    this.loading.show();
    this.showService.removeShow(new RemoveShowRequest(this.showId)).then(resp =>
    {
      if(resp.Status)
      {
        this.isShowAdded = false;
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while adding the show."))
    .finally(() => this.loading.hide());
  }
}
