import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class SearchService {
    private subject = new Subject<string>();

    setSearch(searchText: string) {
        this.subject.next(searchText);
    }    

    clearSearch(): void {
        this.subject.next('');
    }

    get search(): Observable<string> {
        return this.subject;
    }
}