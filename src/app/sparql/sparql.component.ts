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

      const yasgui = new Yasgui(document.getElementById("yasgui") as HTMLElement, {
        requestConfig: { endpoint: "https://fair.classics.ox.ac.uk/wsgi?method=sparql", method: 'GET' },
        copyEndpointOnNewTab: false,
      });
  }
}
