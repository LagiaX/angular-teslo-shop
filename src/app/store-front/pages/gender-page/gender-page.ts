import { Component, inject, ResourceLoaderParams, Signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@products/services/product.service';
import { map } from 'rxjs';
import { ProductCard } from "@products/components/product-card/product-card";
import { I18nSelectPipe } from '@angular/common';
import { Pagination } from "@shared/components/pagination/pagination";
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-gender-page',
  imports: [ProductCard, I18nSelectPipe, Pagination],
  templateUrl: './gender-page.html'
})
export class GenderPage {
  private _route = inject(ActivatedRoute);
  public productService: ProductService = inject(ProductService);
  public paginationService: PaginationService = inject(PaginationService);

  public gender: Signal<string> = toSignal(this._route.params.pipe(map(({ gender }) => gender)));

  public productResource = rxResource({
    params: () => ({ gender: this.gender(), page: this.paginationService.currentPage() }),
    stream: ({ params }) => {
      return this.productService.getProducts({
        gender: params.gender,
        offset: (params.page - 1) * 8
      });
    }
  });

  public translationMap: Record<string, string> = {
    'men': 'hombres',
    'women': 'mujeres',
    'kids': 'niños',
  };

}
