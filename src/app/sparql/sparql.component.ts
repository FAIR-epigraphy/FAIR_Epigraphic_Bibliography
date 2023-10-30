import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/_service/auth.service';
import Yasgui from '@triply/yasgui';

@Component({
  selector: 'app-sparql',
  templateUrl: './sparql.component.html',
  styleUrls: ['./sparql.component.scss']
})
export class SparqlComponent implements OnInit {
  loginUser = null;
  //yasgui!: YasguiComponent;

  constructor(
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    if (this.authService.isAuthenticate()) {
      this.loginUser = JSON.parse(this.authService.getToken() || '{}')
    }
    else
      this.loginUser = null;
    let endpoint = "https://fair.classics.ox.ac.uk/wsgi?method=sparql&repo=biblioRDFTest";

    const yasgui = new Yasgui(document.getElementById("yasgui") as HTMLElement, {
      //requestConfig: { endpoint: "https://fair.classics.ox.ac.uk/graphdb/repositories/biblioRDFTest", method: 'GET' },
      requestConfig: { endpoint: endpoint, method: 'GET' },
      copyEndpointOnNewTab: false,
    });

    this.updateEndPointIfNotExist(endpoint)
  }
  updateEndPointIfNotExist(endpoint: any) {
    let isChanged = false;
    if (localStorage.getItem('yagui__config')) {
      let yasguiConfig = JSON.parse(localStorage.getItem('yagui__config') || '{}');
      for (let tab of yasguiConfig.val.tabs) {
        if (yasguiConfig.val.tabConfig[tab].requestConfig.endpoint !== endpoint) {
          yasguiConfig.val.tabConfig[tab].requestConfig.endpoint = endpoint;
          isChanged = true;
        }
      }
      if (isChanged)
        localStorage.setItem('yagui__config', JSON.stringify(yasguiConfig));
    }
  }
}
