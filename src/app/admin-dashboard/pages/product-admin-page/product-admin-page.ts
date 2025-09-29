import { Component, effect, inject, signal, Signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '@products/services/product.service';
import { map } from 'rxjs';
import { ProductDetails } from "./product-details/product-details";

@Component({
  selector: 'app-product-admin-page',
  imports: [ProductDetails],
  templateUrl: './product-admin-page.html'
})
export class ProductAdminPage {
  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _router: Router = inject(Router);
  private _productService = inject(ProductService);

  public productId: Signal<string | undefined> = toSignal(
    this._activatedRoute.params.pipe(map((params) => params['id']))
  );

  public productResource = rxResource({
    params: () => ({ id: this.productId() }),
    stream: ({ params }) => {
      return this._productService.getProductById(params.id ?? '');
    }
  });

  public redirectEffect = effect(() => {
    if (this.productResource.error()) {
      this._router.navigate(['/admin/products']);
    }
  });
}
