import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  collection : any;

  constructor() {
    this.collection = [{id: 1}, {id: 2}, {id: 3}];
  }
  
  getItems() {
    this.collection = this.getItemsFromServer();
  }
  
  getItemsFromServer() {
    return [{id: 1}, {id: 22}, {id: 3}, {id: 4}];
  }
  
  trackByFn(index, item) {
    return index; // or item.id
  }

}
