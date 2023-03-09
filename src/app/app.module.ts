import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


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

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    BiblioItemListComponent,
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
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [BiblioItemMoreInfoComponent, BiblioParentchildRelComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
