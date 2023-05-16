import { AfterViewChecked, Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements AfterViewChecked {

  title: string = "Error";
  messages: string[] = [];

  constructor() { }

  ngAfterViewChecked(): void {
    $('#errorlist-modal').on('hidden.bs.modal', () =>
    {
      this.reset();
    });
  }

  public addAlert(message: string)
  {
    if(this.messages.length === 0)
    {
      this.show();
    }
    
    this.messages.push(message);

    console.log("messages", this.messages);
  }

  public addAlerts(messages: string[])
  {
    if(this.messages.length === 0)
    {
      this.show();
    }

    this.messages = this.messages.concat(messages);

    console.log("messages", this.messages);
  }

  private show()
  {
    $('#errorlist-modal').modal('show');
  }

  private reset()
  {
    this.title = "Error";
    this.messages = [];
  }
}
