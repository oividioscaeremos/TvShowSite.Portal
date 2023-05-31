import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertOptions } from 'src/models/system-models/alert-option.model';
import { AlertCloseType } from 'src/models/system-models/enums/alert-close-types.enum';

declare var $: any;

@Component({
  selector: 'app-alertbox',
  templateUrl: './alertbox.component.html',
  styleUrls: ['./alertbox.component.scss']
})
export class AlertboxComponent implements AfterViewInit {

  @Output() alertClosedEvent: EventEmitter<AlertCloseType> = new EventEmitter();

  messages: string[] = [];

  alertCloseTypeEnum: typeof AlertCloseType = AlertCloseType;

  title: string = "Alert";
  confirmButtonVisible: boolean = false;

  currentCloseType: AlertCloseType | undefined;
  
  constructor() { }

  ngAfterViewInit(): void
  {
    $('#alertlist-modal').on('hidden.bs.modal', (e: any) => {
      e.preventDefault();
      
      this.alertClosedEvent.emit(this.currentCloseType);

      this.messages = [];
      this.currentCloseType = undefined;
    });
  }

  public addAlert(message: string, options: AlertOptions)
  {
    if(this.messages.length === 0)
    {
      this.show();
    }

    if(options)
    {
      this.confirmButtonVisible = options.IsConfirmButtonVisible;
    }

    this.messages.push(message);
  }

  public modalClose(alertCloseType: AlertCloseType)
  {
    this.currentCloseType = alertCloseType;

    $('#alertlist-modal').modal('hide');
  }

  private show()
  {
    $('#alertlist-modal').modal('show');
  }
}
