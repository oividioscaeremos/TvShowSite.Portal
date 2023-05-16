import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreventLoginGuard implements CanActivate {

  constructor(private router: Router)
  {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree
  {
    console.log('ilker can activate');
    if(localStorage.getItem('accessToken') === null)
    {
      console.log('ilker can activate 2');
      return true;
    }

    this.router.navigate(['/']);
    console.log('ilker can activate 3');

    return false;
  }
  
}
