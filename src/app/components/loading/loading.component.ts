import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {

  isLoading = false;
  loadingCount = 0;

  constructor() { }

  public show()
  {
    this.isLoading = true;
    this.loadingCount++;
  }

  public hide()
  {
    if(--this.loadingCount === 0)
    {
      this.isLoading = false;
    }
  }
}
