import { Component, OnInit } from '@angular/core';
import { BiblApiService } from './_service/bibl-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

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
  ) { }

  async ngOnInit() {
    if (localStorage.getItem('visitor')) {
      let v = JSON.parse(localStorage.getItem('visitor') || '{}');
      this.visitor.visitor_id = v.visitor_id;
      this.visitor.ip_address = v.ip_address;
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
  }

  async getIPAddress(){
    let ipInfo = await this.apiService.getClientIP()
    return ipInfo;
  }

  deleteCache(){
    localStorage.removeItem('allBiblioData');
    window.location.reload();
  }

  getPercentage() {
    if(this.progressBar.count === 0)
      return this.progressBar.message;

    return parseInt(((this.progressBar.processedCount / this.progressBar.count) * 100).toString())
  }
}