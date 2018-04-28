import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MessageService } from '../../messages/message.service';
import { Message } from '../../messages/message.model';
import { SearchService } from './search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SearchComponent implements OnInit {
  searchText: string = '';

  constructor(
    private searchService: SearchService
  ) {
    searchService.search.subscribe(search=>{
      this.searchText = search;
    });
   }

  ngOnInit() {
  }

  onSearchChange(value: string) {    
    this.searchService.setSearch(value);
  }
}
