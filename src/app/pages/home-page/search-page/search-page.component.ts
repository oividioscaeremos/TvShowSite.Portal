import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ErrorComponent } from 'src/app/components/error/error.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { AddShowRequest } from 'src/models/show-models/add-show.model';
import { RemoveShowRequest } from 'src/models/show-models/remove-show.model';
import { Page } from 'src/models/show-models/show-search-component-models';
import { ShowSearchRequest, ShowSearchResponseEntity } from 'src/models/show-models/show-search-models';
import { ShowService } from 'src/services/show.service';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {
  @ViewChild('loading', { static: true }) loading : LoadingComponent;
  @ViewChild('error', { static: true }) error : ErrorComponent;

  pageSize = 20;
  pageIndex = 0;
  totalSearchResultsCount = 0;

  showSearchRequest: ShowSearchRequest = new ShowSearchRequest();
  listedShows: ShowSearchResponseEntity[] = [];

  constructor(
    private router: Router,
    private showService: ShowService
  ) { }

  ngOnInit(): void {
    this.showSearchRequest.Page = 1;
    this.showSearchRequest.PageSize = this.pageSize;
  }

  public search(shouldReturnToPageOne: boolean = true)
  {
    if(this.showSearchRequest.Name?.length >= 3)
    {
      if(shouldReturnToPageOne)
      {
        this.pageIndex = 0;
        this.showSearchRequest.Page = this.pageIndex + 1;
      }
      this.loading.show();
      this.showService.search(this.showSearchRequest).then(resp =>
      {
        console.log("resp", resp);
        if(resp.Status)
        {
          this.listedShows = resp.Value;
          this.totalSearchResultsCount = resp.TotalResults;
        }
        else
        {
          this.error.addAlerts(resp.ErrorList);
        }
      })
      .catch(() =>
      {
        this.error.addAlert("Something unexcepted happened while searching shows.");
      })
      .finally(() =>
      {
        this.loading.hide();
      });
    }
    else
    {
      this.error.addAlert("Search box needs to have at least three characters in it before the searching can be done.");
    }
  }

  public addShow(id: number, movieDbId: number, callBackFn?: any)
  {
    this.loading.show();
    this.showService.addShow(new AddShowRequest(id, movieDbId, callBackFn === undefined || callBackFn === null)).then(resp =>
    {
      if(resp.Status)
      {
        let show = this.listedShows.find(show => show.Id === id || show.MovieDbId === movieDbId) as ShowSearchResponseEntity;
        
        if(show)
        {
          show.IsAdded = true;
        }

        if(callBackFn)
        {
          callBackFn(resp.Value);
        }
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexcepted happened while adding the show."))
    .finally(() => this.loading.hide());
  }

  public removeShow(id: number)
  {
    this.loading.show();
    this.showService.removeShow(new RemoveShowRequest(id)).then(resp =>
    {
      if(resp.Status)
      {
        let show = this.listedShows.find(show => show.Id === id) as ShowSearchResponseEntity;

        if(show)
        {
          show.IsAdded = false;
        }
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexcepted happened while removing the show."))
    .finally(() => this.loading.hide());
  }

  public goTo(event: PageEvent)
  {
    this.showSearchRequest.Page = event.pageIndex + 1;
    this.showSearchRequest.PageSize = event.pageSize;
    this.search(false);
  }

  public keyPress(e: KeyboardEvent)
  {
    console.log("keypress", e);
    if(e.key === 'Enter')
    {
      this.search();
    }
  }

  public navigateToShowPage(show: ShowSearchResponseEntity)
  {
    if(show.Id)
    {
      this.router.navigateByUrl('/show/' + show.Id);
    }
    else
    {
      this.addShow(show.Id, show.MovieDbId, (showId: number) => this.router.navigateByUrl('/show/' + showId));
    }
  }
}
