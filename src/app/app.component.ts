import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public progressBar = { count: 0, processedCount: 0 };

  constructor(
  ) { }

  ngOnInit() {
    
  }

  getPercentage(){
    return parseInt(((this.progressBar.processedCount / this.progressBar.count) * 100).toString())
  }
}