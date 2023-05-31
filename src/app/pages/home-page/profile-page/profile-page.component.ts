import { AfterViewChecked, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertboxComponent } from 'src/app/components/alertbox/alertbox.component';
import { ErrorComponent } from 'src/app/components/error/error.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { ChangeMailAddressRequest } from 'src/models/authorization-models/change-mail.model';
import { ChangeUserPictureRequest } from 'src/models/authorization-models/change-user-picture.model';
import { GetUserProfileDetailRequest } from 'src/models/authorization-models/get-profile-detail.model';
import { GetShowNotesShowEntity } from 'src/models/show-models/get-show-note.model';
import { GetUserShowResponseEntity } from 'src/models/show-models/get-user-show.model';
import { AlertCloseType } from 'src/models/system-models/enums/alert-close-types.enum';
import { AccountService } from 'src/services/account.service';
import { ShowService } from 'src/services/show.service';

declare var $: any;
declare var bsCustomFileInput: any;

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit, AfterViewChecked {
  @ViewChild('loading', { static: true }) loading : LoadingComponent;
  @ViewChild('error', { static: true }) error : ErrorComponent;
  @ViewChild('alertBox', { static: true }) alertBox : AlertboxComponent;
  
  userId: number | undefined;

  isUsersOwnProfile: boolean = false;
  userProfilePictureUrl: string = "";
  userCoverUrl: string = "";
  emailAddress: string = "";
  username: string = "";
  userShows: GetUserShowResponseEntity[] = [];
  userNotes: GetShowNotesShowEntity[] = []

  password: string = "";
  passwordAgain: string = "";

  alertBoxFlags = {
    isUpdatingCoverPicture: false,
    isUpdatingProfilePicture: false,
    isUpdatingMailAddress: false
  }

  currentFile: File | undefined;

  constructor(
    private route: ActivatedRoute,
    private accountService: AccountService,
    private showService: ShowService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params =>
    {
      if(params.has("userId"))
      {
        this.userId = parseInt(params.get("userId") as string);
      }

      this.getUserProfileDetail();
      this.getUserShows();
    });
  }

  ngAfterViewChecked(): void {
    bsCustomFileInput.init();
  }

  public updatePictureBtnClick(fileInputId: string, isCoverPicture: boolean, isProfilePicture: boolean)
  {
    let files = $('#' + fileInputId).prop('files');

    if(files?.length > 0)
    {
      this.alertBoxFlags.isUpdatingCoverPicture = isCoverPicture;
      this.alertBoxFlags.isUpdatingProfilePicture = isProfilePicture;

      this.currentFile = files[0] as File;

      this.alertBox.addAlert((isCoverPicture ? "Cover" : "Profile") + " picture will be updated, do you confirm?", {
        IsConfirmButtonVisible: true
      });
    }
  }

  public changeMailBtnClick()
  {
    if(new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$").test(this.emailAddress))
    {
      this.alertBoxFlags.isUpdatingMailAddress = true;

      this.alertBox.addAlert("Your email address will be updated to '" + this.emailAddress + "', do you confirm?", {
        IsConfirmButtonVisible: true
      });
    }
    else
    {
      this.error.addAlert("Please enter a valid mail address.");
    }
  }

  public alertBoxClosed(alertBoxClosedType: AlertCloseType)
  {
    if(alertBoxClosedType === AlertCloseType.Confirm)
    {
      if(this.alertBoxFlags.isUpdatingCoverPicture)
      {
        this.uploadPicture((pictureUrl: string) => this.completeChangePicture(pictureUrl, true, false));
      }
      else if(this.alertBoxFlags.isUpdatingProfilePicture)
      {
        this.uploadPicture((pictureUrl: string) => this.completeChangePicture(pictureUrl, false, true));
      }
      else if(this.alertBoxFlags.isUpdatingMailAddress)
      {
        this.changeMail();
      }
    }

    this.alertBoxFlags.isUpdatingCoverPicture = false;
    this.alertBoxFlags.isUpdatingProfilePicture = false;
    this.alertBoxFlags.isUpdatingMailAddress = false;
  }

  private getUserProfileDetail()
  {
    this.loading.show();
    this.accountService.getUserProfileDetail(new GetUserProfileDetailRequest(this.userId)).then(resp =>
    {
      if(resp.Status)
      {
        this.userCoverUrl = resp.Value.CoverPictureUrl;
        this.userProfilePictureUrl = resp.Value.ProfilePictureUrl;
        this.isUsersOwnProfile = resp.Value.IsUsersOwnProfile;
        this.username = resp.Value.Username;

        if(this.isUsersOwnProfile)
        {
          this.getUserNotes();
          this.emailAddress = resp.Value.MailAddress;
        }
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching the profile details."))
    .finally(() => this.loading.hide());
  }

  private uploadPicture(callBackFn: any)
  {
    this.loading.show();
    this.accountService.uploadFile(this.currentFile!).then(resp =>
    {
      if(resp.Status)
      {
        this.currentFile = undefined;

        callBackFn(resp.Value);
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while uploading the picture."))
    .finally(() => this.loading.hide());
  }

  private completeChangePicture(pictureUrl: string, isCoverPicture: boolean, isProfilePicture: boolean)
  {
    this.loading.show();
    this.accountService.changeUserPicture(new ChangeUserPictureRequest(pictureUrl, isCoverPicture, isProfilePicture)).then(resp =>
    {
      if(resp.Status)
      {
        if(isCoverPicture)
        {
          this.userCoverUrl = pictureUrl;
          
          $("#cover-picture-picker").val('');
          $("#cover-picture-picker").next('label').html('Choose a new cover picture');
        }
        else if(isProfilePicture)
        {
          this.userProfilePictureUrl = pictureUrl;

          $("#profile-picture-picker").val('');
          $("#profile-picture-picker").next('label').html('Choose a new profile picture');
        }
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while changing the profile picture."))
    .finally(() => this.loading.hide());
  }

  private changeMail()
  {
    this.loading.show();
    this.accountService.changeMail(new ChangeMailAddressRequest(this.emailAddress)).then(resp =>
    {
      if(!resp.Status)
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while changing the mail address."))
    .finally(() => this.loading.hide());
  }

  private getUserNotes()
  {
    this.loading.show();
    this.showService.getShowNotes().then(resp =>
    {
      if(resp.Status)
      {
        this.userNotes = resp.Value;
        console.log("user notes", resp.Value);
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching the user notes."))
    .finally(() => this.loading.hide());
  }

  private getUserShows()
  {
    this.loading.show();
    this.showService.getUserShows(this.userId).then(resp =>
    {
      if(resp.Status)
      {
        this.userShows = resp.Value;
        console.log("user shows", resp.Value);
      }
      else
      {
        this.error.addAlerts(resp.ErrorList);
      }
    })
    .catch(() => this.error.addAlert("Something unexpected happened while fetching the user notes."))
    .finally(() => this.loading.hide());
  }
}
