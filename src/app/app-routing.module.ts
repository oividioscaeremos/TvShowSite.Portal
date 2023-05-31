import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AppComponent } from './app.component';
import { PreventUnauthorizedAccessGuard } from './guards/prevent-unauthorized-access.guard';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ShowPageComponent } from './pages/home-page/show-page/show-page.component';
import { PreventLoginGuard } from './guards/prevent-login.guard';
import { SearchPageComponent } from './pages/home-page/search-page/search-page.component';
import { NextToWatchPageComponent } from './pages/home-page/next-to-watch-page/next-to-watch-page.component';
import { EpisodeComponent } from './pages/home-page/episode/episode.component';
import { ProfilePageComponent } from './pages/home-page/profile-page/profile-page.component';

const routes: Routes = [
  { path: 'register', component: RegisterPageComponent, canActivate: [PreventLoginGuard] },
  { path: 'login', component: LoginPageComponent, canActivate: [PreventLoginGuard] },
  { 
    path: '', component: HomePageComponent, 
    canActivate: [PreventUnauthorizedAccessGuard],
    children: [
      {
        path: '',
        component: NextToWatchPageComponent
      },
      { 
        pathMatch: "full",
        path: 'show/:id', 
        component: ShowPageComponent 
      },
      { 
        pathMatch: "full",
        path: 'show/:showId/episode/:episodeId', 
        component: EpisodeComponent 
      },
      { 
        path: 'search', 
        component: SearchPageComponent 
      },
      { 
        path: 'profile', 
        children: [
          { path: '', component: ProfilePageComponent },
          { path: ':userId', component: ProfilePageComponent}
        ]
      },
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
