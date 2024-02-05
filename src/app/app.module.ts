import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ItemListComponent } from './_component/item-list/item-list.component';
import { BiblioItemListComponent } from './_component/biblio-item-list/biblio-item-list.component';
import { BiblioItemMoreInfoComponent } from './_component/biblio-item-more-info/biblio-item-more-info.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LogoutComponent } from './logout/logout.component';
import { BiblioParentchildRelComponent } from './_component/biblio-parentchild-rel/biblio-parentchild-rel.component';
import { CustomFilterPipe } from './_pipes/custom-filter.pipe';
import { SettingComponent } from './setting/setting.component';
import { ManageUserComponent } from './setting/manage-user/manage-user.component';
import { ManageRoleComponent } from './setting/manage-role/manage-role.component';
import { ManageBiblioItemCategoryComponent } from './setting/manage-biblio-item-category/manage-biblio-item-category.component';
import { NavBarComponent } from './_component/nav-bar/nav-bar.component';
import { childViewContainerDirective } from './_component/biblio-item-list/child.view.container.directive'
import { ChildListComponent  } from './_component/biblio-item-list/child-list/child-list.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component'
import { NgSelectModule } from '@ng-select/ng-select';
import { BiblioAdvanceSearchComponent } from './_component/biblio-advance-search/biblio-advance-search.component';
import { BiblioItemAlignmentComponent } from './_component/biblio-item-alignment/biblio-item-alignment.component';
import { BiblioItemCompareComponent } from './_component/biblio-item-alignment/biblio-item-compare/biblio-item-compare.component';
import { AbbreviationListComponent } from './_component/abbreviation-list/abbreviation-list.component';
import { SparqlComponent } from './sparql/sparql.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AieglAbbreviationComponent } from './_component/aiegl-abbreviation/aiegl-abbreviation.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    BiblioItemListComponent,
    childViewContainerDirective,
    ChildListComponent,
    BiblioItemMoreInfoComponent,
    LoginComponent,
    HomeComponent,
    LogoutComponent,
    BiblioParentchildRelComponent,
    CustomFilterPipe,
    SettingComponent,
    ManageUserComponent,
    ManageRoleComponent,
    ManageBiblioItemCategoryComponent,
    NavBarComponent,
    PagenotfoundComponent,
    BiblioAdvanceSearchComponent,
    BiblioItemAlignmentComponent,
    BiblioItemCompareComponent,
    AbbreviationListComponent,
    SparqlComponent,
    LandingPageComponent,
    AieglAbbreviationComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  providers: [BiblioItemMoreInfoComponent, BiblioParentchildRelComponent, childViewContainerDirective, ChildListComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
