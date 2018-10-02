declare const moment:any;

import { Component } from '@angular/core';
import { APIService } from '../../services';

@Component({
  selector: 'reviews-row-component',
  templateUrl: './review-row.component.html',
  styleUrls: ['./review.scss']
})
export class ReviewsRowComponent {
  public reviews:{
    title:string;
    text:string;
    consumerDisplayName:string;
    createdAt:any;
  }[] = [];

  constructor(private api:APIService) {
  }

  ngOnInit() {
    this.api.reviews().subscribe( (json:any) => {
      this.reviews = json.map( (r) => {
        return {
          title:r.title,
          text:r.text,
          consumerDisplayName:r.consumer.displayName,
          createdAt:moment(r.createdAt).format('MMMM Do YYYY')
        }
      });
      // debugger;
    })
  // get(url:string, modal:boolean = false) { return this.request(this.http.get(`${url}`), modal); }
    //
// $pp_review['reviews'][$i]['title']
// $pp_review['reviews'][$i]['text']
// $pp_review['reviews'][$i]['consumer']['displayName']
// $pp_review['reviews'][$i]['createdAt']
  }
}
