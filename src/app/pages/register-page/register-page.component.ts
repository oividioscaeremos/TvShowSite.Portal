import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { RegisterRequest } from 'src/models/authorization-models/registers-models.model';
import { AccountService } from 'src/services/account.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent {
  @ViewChild('loading', { static: true }) loading: LoadingComponent;

  showErrors = false;

  loginFormGroup = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    emailAddress: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    password: new FormControl('', [Validators.required]),
    passwordAgain: new FormControl('', [Validators.required]),
  });

  errorMessages: string[] = [];

  constructor(private router: Router, private accountService: AccountService) {}

  public register() {
    if (this.loginFormGroup.valid 
      && this.loginFormGroup.controls['password'].value === this.loginFormGroup.controls['passwordAgain'].value) 
    {
      var registerRequest = new RegisterRequest();
      registerRequest.Username = this.loginFormGroup.controls.username.value as string;
      registerRequest.EmailAddress = this.loginFormGroup.controls.emailAddress.value as string;
      registerRequest.Password = this.loginFormGroup.controls.password.value as string;

      this.loading.show();
      this.accountService.register(registerRequest).then((resp) => 
      {
        this.loading.hide();
        
        if (resp.Status)
        {
          this.router.navigate(['/']);
        }
        else
        {
          this.errorMessages = resp.ErrorList as string[];
          this.showErrors = true;
          console.log("errorMessages", this.errorMessages);
        }
      })
      .catch((err) =>
      {
        alert('Something went wrong while registering.');
      })
      .finally(() => this.loading.hide());
    }
    else if( this.loginFormGroup.controls.password !== this.loginFormGroup.controls.passwordAgain)
    {
      this.loginFormGroup.controls.password.setErrors({
        passwordDontMatch: true,
      });
      this.loginFormGroup.controls.passwordAgain.setErrors({
        passwordDontMatch: true,
      });
    }

    this.loginFormGroup.markAsTouched();
  }
}
