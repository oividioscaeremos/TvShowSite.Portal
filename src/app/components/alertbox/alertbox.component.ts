import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AlertOptions } from 'src/models/system-models/alert-option.model';
import { AlertCloseType } from 'src/models/system-models/enums/alert-close-types.enum';

declare var $: any;

@Component({
  selector: 'app-alertbox',
  templateUrl: './alertbox.component.html',
  styleUrls: ['./alertbox.component.scss']
})
export class AlertboxComponent implements OnInit, AfterViewInit {

  @Output() alertClosedEvent: EventEmitter<AlertCloseType> = new EventEmitter();

  messages: string[] = [];

  alertCloseTypeEnum: typeof AlertCloseType = AlertCloseType;

  title: string = "Alert";
  confirmButtonVisible: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void
  {
    $('#alertlist-modal').on('hidden.bs.modal', (e: any) => {
      e.preventDefault();
      
      this.messages = [];
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
    this.alertClosedEvent.emit(alertCloseType);

    $('#alertlist-modal').modal('hide');
  }

  private show()
  {
    $('#alertlist-modal').modal('show');
  }
}
