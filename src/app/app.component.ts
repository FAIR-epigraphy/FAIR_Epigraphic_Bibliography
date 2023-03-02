import { Component, OnInit, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './_service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'fair-biblio';
  loginUser = null;
  keysPressed: any = {};
  public mainSearchBar: string = '';

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    if (this.authService.isAuthenticate())
      this.loginUser = JSON.parse(this.authService.getToken() || '{}')
    else
      this.loginUser = null;
  }

  @HostListener('document:keydown', ['$event'])
  @HostListener('document:keyup', ['$event'])
  handleKeyEvents(event: KeyboardEvent) {
    //console.log(event)
    if (event.type === 'keydown') {
      if (event.key === 'Shift' || event.key === 'C' || event.key === 'R')
        this.keysPressed[event.key] = true;

      if (this.keysPressed['Shift'] && this.keysPressed['C'] && this.keysPressed['R']) {
        //alert('Refreshed');
        this.keysPressed = {}
        localStorage.removeItem(`allBiblioData`)
        localStorage.removeItem(`biblioLibrary`)
        window.location.reload();
      }
    }
    else if(event.type === 'keyup')
    {
      delete this.keysPressed[event.key];
    }
  }
}