import { Component, OnInit, OnDestroy, AfterViewInit} from '@angular/core';
import { BiblApiService } from './_service/bibl-api.service';
import { NgcCookieConsentService, NgcInitializationErrorEvent, NgcInitializingEvent, NgcNoCookieLawEvent, NgcStatusChangeEvent } from 'ngx-cookieconsent';
import { Subscription }   from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  //keep refs to subscriptions to be able to unsubscribe later
  private popupOpenSubscription!: Subscription;
  private popupCloseSubscription!: Subscription;
  private initializingSubscription!: Subscription;
  private initializedSubscription!: Subscription;
  private initializationErrorSubscription!: Subscription;
  private statusChangeSubscription!: Subscription;
  private revokeChoiceSubscription!: Subscription;
  private noCookieLawSubscription!: Subscription;

  public progressBar = { count: 0, processedCount: 0, message: '' };
  public visitor = {
    visitor_id: '',
    access_url: '',
    ip_address: '',
    city: '',
    continentCode: '',
    countryCode: '',
    countryName: '',
    stateProv: ''   
  };

  constructor(
    private apiService: BiblApiService,
    private ccService: NgcCookieConsentService
  ) { }

  async ngOnInit() {
    if (localStorage.getItem('visitor')) {
      let v = JSON.parse(localStorage.getItem('visitor') || '{}');
      this.visitor.visitor_id = v.visitor_id;
      this.visitor.ip_address = v.ip_address;
      this.visitor.access_url = window.location.hostname;
      await this.apiService.callVisitorCounter(this.visitor);
    }
    else{
      let info = await this.getIPAddress();
      this.visitor.ip_address = info.ipAddress;
      this.visitor.access_url = window.location.hostname;
      this.visitor.city = info.city;
      this.visitor.continentCode = info.continentCode;
      this.visitor.countryCode = info.countryCode;
      this.visitor.countryName = info.countryName;
      this.visitor.stateProv = info.stateProv;

      let visitor : any = await this.apiService.callVisitorCounter(this.visitor);
      if(typeof visitor === 'object'){
        console.log(visitor.message);
      }
      else{
        localStorage.setItem('visitor', JSON.stringify({visitor_id: visitor, ip_address: this.visitor.ip_address}))
      }
    }
    ///////////////////////////////////////////////////////////
    ////////////////// Cookie Consent
    // subscribe to cookieconsent observables to react to main events
    this.popupOpenSubscription = this.ccService.popupOpen$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
        //console.log(this.ccService.getConfig())
        (document.getElementById('overlay') as HTMLElement).style.display = 'block';
      });

    this.popupCloseSubscription = this.ccService.popupClose$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
        (document.getElementById('overlay') as HTMLElement).style.display = 'none';
        //window.location.reload();
      });

    this.initializingSubscription = this.ccService.initializing$.subscribe(
      (event: NgcInitializingEvent) => {
        // the cookieconsent is initilializing... Not yet safe to call methods like `NgcCookieConsentService.hasAnswered()`
        console.log(`initializing: ${JSON.stringify(event)}`);
      });
    
    this.initializedSubscription = this.ccService.initialized$.subscribe(
      () => {
        // the cookieconsent has been successfully initialized.
        // It's now safe to use methods on NgcCookieConsentService that require it, like `hasAnswered()` for eg...
        console.log(`initialized: ${JSON.stringify(event)}`);
      });

    this.initializationErrorSubscription = this.ccService.initializationError$.subscribe(
      (event: NgcInitializationErrorEvent) => {
        // the cookieconsent has failed to initialize... 
        console.log(`initializationError: ${JSON.stringify(event.error?.message)}`);
      });

    this.statusChangeSubscription = this.ccService.statusChange$.subscribe(
      (event: NgcStatusChangeEvent) => {
        console.log(event);
        if(event.status === 'allow'){
          window.location.reload();
        }
      });

    this.revokeChoiceSubscription = this.ccService.revokeChoice$.subscribe(
      () => {
        // you can use this.ccService.getConfig() to do stuff...
        console.log(this.ccService.getConfig())});

      this.noCookieLawSubscription = this.ccService.noCookieLaw$.subscribe(
      (event: NgcNoCookieLawEvent) => {
        // you can use this.ccService.getConfig() to do stuff...
        console.log(this.ccService.getConfig())
      });
  }

  ngOnDestroy() {
    // unsubscribe to cookieconsent observables to prevent memory leaks
    this.popupOpenSubscription.unsubscribe();
    this.popupCloseSubscription.unsubscribe();
    this.initializingSubscription.unsubscribe();
    this.initializedSubscription.unsubscribe();
    this.initializationErrorSubscription.unsubscribe();
    this.statusChangeSubscription.unsubscribe();
    this.revokeChoiceSubscription.unsubscribe();
    this.noCookieLawSubscription.unsubscribe();
  }

  async getIPAddress(){
    let ipInfo = await this.apiService.getClientIP()
    return ipInfo;
  }

  deleteCache(){
    // localStorage.removeItem('allBiblioData');
    // window.location.reload();
  }

  getPercentage() {
    if(this.progressBar.count === 0)
      return this.progressBar.message;

    return parseInt(((this.progressBar.processedCount / this.progressBar.count) * 100).toString())
  }
}