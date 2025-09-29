import { CurrencyPipe } from '@angular/common';
import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductApi } from '@products/interfaces/product.interface';
import { ProductImagePipe } from '@products/pipes/product-image.pipe';

@Component({
  selector: 'product-table',
  imports: [RouterLink, ProductImagePipe, CurrencyPipe],
  templateUrl: './product-table.html'
})
export class ProductTable {
  public products: InputSignal<ProductApi[]> = input.required<ProductApi[]>();
}
