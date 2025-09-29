import { Component, inject, ResourceRef, signal, WritableSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductTable } from "@products/components/product-table/product-table";
import { ProductResponse } from '@products/interfaces/product.interface';
import { ProductService } from '@products/services/product.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { Pagination } from "@shared/components/pagination/pagination";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTable, Pagination, RouterLink],
  templateUrl: './products-admin-page.html'
})
export class ProductsAdminPage {
  public productService: ProductService = inject(ProductService);
  public paginationService: PaginationService = inject(PaginationService);

  public productsPerPage: WritableSignal<number> = signal<number>(5);

  public productResource: ResourceRef<ProductResponse | undefined> = rxResource({
    params: () => ({ page: this.paginationService.currentPage(), limit: this.productsPerPage() }),
    stream: ({ params }) => {
      return this.productService.getProducts({
        offset: (params.page - 1) * 8,
        limit: params.limit
      });
    }
  });
}
