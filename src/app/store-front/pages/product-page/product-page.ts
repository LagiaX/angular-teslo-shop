import { Component, inject, ResourceLoaderParams } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '@products/services/product.service';
import { ProductCarousel } from "@products/components/product-carousel/product-carousel";

@Component({
  selector: 'app-product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.html'
})
export class ProductPage {
  public productService: ProductService = inject(ProductService);
  private _routeService: ActivatedRoute = inject(ActivatedRoute);

  public productResource = rxResource({
    params: () => ({ idSlug: this._routeService.snapshot.paramMap.get('idSlug') ?? ''}),
    stream: ({ params }) => this.productService.getProductByIdSlug(params.idSlug)
  });
}
