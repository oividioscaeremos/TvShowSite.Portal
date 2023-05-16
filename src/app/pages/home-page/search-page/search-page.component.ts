import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ErrorComponent } from 'src/app/components/error/error.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
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

  public goTo(event: PageEvent)
  {
    this.showSearchRequest.Page = event.pageIndex + 1;
    this.showSearchRequest.PageSize = event.pageSize;
    this.search(false);
  }
}
