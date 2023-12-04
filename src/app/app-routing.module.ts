import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { SettingComponent } from './setting/setting.component';
import { SparqlComponent } from './sparql/sparql.component';
import { AbbreviationListComponent } from './_component/abbreviation-list/abbreviation-list.component';
import { BiblioAdvanceSearchComponent } from './_component/biblio-advance-search/biblio-advance-search.component';
import { BiblioItemAlignmentComponent } from './_component/biblio-item-alignment/biblio-item-alignment.component';

const routes: Routes = [
  { path: ':callNum', component: LandingPageComponent },
  { path: 'biblio/bibliography', component: HomeComponent },
  { path: '', component: LandingPageComponent },
  { path: 'user/login', component: LoginComponent },
  { path: 'user/logout', component: LogoutComponent },
  { path: 'user/setting', component: SettingComponent },
  { path: 'biblio/advance-search', component: BiblioAdvanceSearchComponent },
  { path: 'biblio/alignment', component: BiblioItemAlignmentComponent },
  { path: 'biblio/abbreviations', component: AbbreviationListComponent },
  { path: 'biblio/sparql', component: SparqlComponent },
  //Wild Card Route for 404 request
  { path: '**', pathMatch: 'full', component: PagenotfoundComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
