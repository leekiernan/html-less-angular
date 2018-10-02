declare const window:any;
declare const $:any;
declare const Waypoint:any;
const XL_WIDTH:number = 1350;

import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormArray } from '@angular/forms';

import { FormService, QuoteService } from '../../../services';

@Component({
  selector: 'cover-mobile-component',
  templateUrl: './mobile.component.html',
  styleUrls: ['./cover-options.component.scss']
})
export class CoverOptionsMobileComponent {
  public choice:any;
  public currentSlide:number;
  public form:FormGroup;
  public name:string = 'Cover';
  public pets:FormGroup;
  public showInfo?:string;
  public vetFeeCover:any;

  constructor(public fs:FormService, public quote:QuoteService) {
    this.form = <FormGroup>fs.data.get('cover');
    this.pets = <FormGroup>fs.data.get('details.pets');
    this.choice = this.form.value.choice;
    this.vetFeeCover = this.form.value.vetFeeCover;
  }

  ngOnInit() {
    this.form.get('choice').valueChanges.subscribe( (v:string) => this.choice = v );
    this.form.get('vetFeeCover').valueChanges.subscribe( (v:string) => this.vetFeeCover = v );
  }

  initWaypoint() {
    const stick = document.getElementById('thead-waypoint');
    const start = document.getElementById('waypoint-start');
    const end = document.getElementById('waypoint-stop');
    if (!stick) { return false; }

    window.waypoints = {}
    window.waypoints.start = new Waypoint({
      element:start,
      handler: (dir:string) => {
        dir == 'down' ? stick.classList.add('fixed-top') : stick.classList.remove('fixed-top');
      }
    });
    window.waypoints.end = new Waypoint({
      element:end,
      offset:100,
      handler: (dir:string) => {
        dir == 'up' ? stick.classList.add('fixed-top') : stick.classList.remove('fixed-top');
      }
    });
  }

  ngAfterContentInit() {
    if ($(window).width() < XL_WIDTH) {
      this.initWaypoint();
    }

    let slider = $('.dotless-carousel');
    let settings = {
      mobileFirst:true,
      speed:300,
      slidesToShow:1,
      arrows:false,
      variableWidth:false,
      centerMode:false, dots:false, infinite:false,
      adaptiveHeight:true
    };
    slider.slick(settings);
    this.currentSlide = 0;

    slider.on('afterChange', (evt,slick,currentSlide) => {
      this.currentSlide = currentSlide;
    });

    this.scrollToChoice(this.choice);

    $(window).on('resize', () => {
      if ($(window).width() >= XL_WIDTH) {
        Waypoint.destroyAll();
        if (slider.hasClass('slick-initialized')) {
          slider.slick('unslick');
        }
        return;
      }

      if (!slider.hasClass('slick-initialized')) {
        this.initWaypoint();
        slider.slick(settings);
        this.scrollToChoice(this.choice);
      }
    });
  }

  scrollTo(ix:number) {
    $('.slick-slider').slick('slickGoTo', ix);
  }

  scrollToChoice(cover?:string) {
    switch(cover) {
      case "PPL Time Care Plus": this.scrollTo(0);
      case "PPL Time Care Essential": this.scrollTo(0);
      case "PPL Condition Care Plus": this.scrollTo(1);
      case "Lifetime Value": this.scrollTo(2);
      case "Plus": this.scrollTo(2);
      case "Extra": this.scrollTo(2);
      default: 
        if ($(window).width() < XL_WIDTH) {
          this.scrollTo(2);
        } else {
          this.scrollTo(0);
        }
    }
  }

  collapse(c:string) {
    this.showInfo = this.showInfo === c ? null : c;
  }
}
