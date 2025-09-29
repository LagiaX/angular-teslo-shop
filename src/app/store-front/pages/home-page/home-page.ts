import { Component, inject, ResourceRef } from '@angular/core';
import { ProductCard } from '@products/components/product-card/product-card';
import { ProductService } from '@products/services/product.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { Pagination } from "@shared/components/pagination/pagination";
import { ProductResponse } from '@products/interfaces/product.interface';
import { PaginationService } from '@shared/components/pagination/pagination.service';

@Component({
  selector: 'app-home-page',
  imports: [ProductCard, Pagination],
  templateUrl: './home-page.html'
})
export class HomePage {
  public productService: ProductService = inject(ProductService);
  public paginationService: PaginationService = inject(PaginationService);

  public productResource: ResourceRef<ProductResponse | undefined> = rxResource({
    params: () => ({ page: this.paginationService.currentPage() }),
    stream: ({ params }) => {
      return this.productService.getProducts({ offset: (params.page - 1) * 8 });
    }
  });
}
