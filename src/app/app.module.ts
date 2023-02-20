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
