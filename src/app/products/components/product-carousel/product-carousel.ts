import {
  AfterViewInit,
  Component,
  ElementRef,
  input,
  InputSignal,
  OnChanges,
  SimpleChanges,
  viewChild,
  Signal
} from '@angular/core';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

@Component({
  selector: 'product-carousel',
  imports: [ProductImagePipe],
  templateUrl: './product-carousel.html',
  styles: `
    .swiper {
      width: 100%;
    }
  `
})
export class ProductCarousel implements AfterViewInit, OnChanges {
  public images: InputSignal<string[]> = input.required<string[]>();
  public swiperDiv: Signal<ElementRef> = viewChild.required<ElementRef>('swiperDiv');
  public swiper: Swiper | undefined = undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images'].firstChange) {
      return;
    }
    setTimeout(() => this._swiperInit()), 100;
  }

  ngAfterViewInit(): void {
    this._swiperInit();
  }

  private _swiperInit(): void {
    const element: HTMLElement = this.swiperDiv().nativeElement;
    if (!element) return;

    this.swiper = new Swiper(element, {
      // Optional parameters
      direction: 'horizontal',
      loop: true,
      modules: [Navigation, Pagination],
      pagination: {
        el: '.swiper-pagination',
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    });
  }
}
