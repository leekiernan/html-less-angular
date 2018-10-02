import { Component, Directive, ElementRef, Input } from '@angular/core';
// import { Component, ContentChild, ContentChildren, ElementRef, Input, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

interface MockFormGroup {
  invalid:boolean;
  dirty:boolean;
}

// extended-input
@Component({
  selector: 'extended-input',
  styleUrls:['./form-input.component.scss'],
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  },
  templateUrl: './input.component.html'
})
export class ExtendedInputComponent {
  @Input() public key:string;
  @Input() public group?:FormGroup | MockFormGroup;

  public hasTooltip?:boolean = false;
  public required?:boolean = false;
  public showTooltip?:boolean = false;

  constructor(private _er:ElementRef) { }

  ngOnInit() {
    this.required = !!this._er.nativeElement.hasAttribute('required');
    this.hasTooltip = !!this._er.nativeElement.hasAttribute('hasTooltip');

    if (!this.group) { this.group = { invalid:false, dirty:false }; }
  }

  ngAfterContentInit() { }

  isMobile() {
    let w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = w.innerWidth || e.clientWidth || g.clientWidth,
    y = w.innerHeight|| e.clientHeight|| g.clientHeight;
    return x < 1200;
  }

  ensureTooltipVisible(curpos:number) {
    setTimeout( (cp) => {
      let el = this._er.nativeElement.getElementsByClassName('tooltips')[0];

      let moved = (window.pageYOffset || document.documentElement.scrollTop) - cp;
      if ( moved < -50 || moved > 50 || !el) { return false; }

      let pos = (window.innerHeight - el.getBoundingClientRect().top)

      if (pos < 25) {
        window.scrollTo(0, cp + pos + 100);
      }
    }, 333, curpos);
  }

  show() {
    this.showTooltip = true;

    if (this.isMobile()) {
      this.ensureTooltipVisible(window.pageYOffset || document.documentElement.scrollTop);
    }
  }
  hide() { this.showTooltip = false; }
  toggle() { !!this.showTooltip ? this.hide() : this.show(); }

  onMouseEnter() {
    if (this.hasTooltip && !this.isMobile()) { this.show(); }
  }
  onMouseLeave() {
    if (this.hasTooltip && !this.isMobile()) { this.hide(); }
  }
}
