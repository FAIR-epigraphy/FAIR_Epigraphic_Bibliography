import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public progressBar = { count: 0, processedCount: 0, message: '' };

  constructor(
  ) { }

  ngOnInit() {

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