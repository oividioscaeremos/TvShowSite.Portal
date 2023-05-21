import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { LoginRequest } from 'src/models/authorization-models/login-models.model';
import { AccountService } from 'src/services/account.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  
})
export class LoginPageComponent implements OnInit {
  @ViewChild('loading', { static: true }) loading : LoadingComponent;

  errorMessages: string[] = [];

  loginFormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required
    ]),
    password: new FormControl('', [
      Validators.required
    ])
  });

  constructor(
    private accountService: AccountService,
    private router: Router) { }

  ngOnInit(): void {
  }

  public login()
  {
    if(this.loginFormGroup.valid)
    {
      var loginRequest = new LoginRequest();
      loginRequest.Username = this.loginFormGroup.controls.username.value as string;
      loginRequest.Password = this.loginFormGroup.controls.password.value as string;

      this.loading.show();
      this.accountService.login(loginRequest).then(resp =>
      {
        console.log("ilker loginResp", resp);
        
        if(resp.Status)
        {
          localStorage.setItem("accessToken", resp.Value?.AccessToken ?? '');
          localStorage.setItem("refreshToken", resp.Value?.RefreshToken ?? '');
          this.router.navigate(['/']);
        }
        else
        {
          this.errorMessages = resp.ErrorList as string[];
        }
      }).catch(err =>
      {
        alert("Something unexpected happened during login.");
      })
      .finally(() => 
      {
        this.loading.hide();
      });
    }
  }

  public keyPress(e: KeyboardEvent)
  {
    if(e.key === "Enter")
    {
      this.login();
    }
  }
}
