import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorComponent } from 'src/app/components/error/error.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { FavoriteCharactersResponseEntity } from 'src/models/show-models/favorite-characters.model';
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
          this.getShowPosterURL();
          this.getShowDescription();
          this.getFavoriteCharacters();
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
}
