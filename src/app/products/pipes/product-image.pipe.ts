import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl: string = environment.baseUrl;

@Pipe({ name: 'productImage' })
export class ProductImagePipe implements PipeTransform {
  transform(value: string | string[] | null): string {
    if (value === null) {
      return `./assets/images/no-image.jpg`;
    }
    if (typeof value === 'string' && value.startsWith('blob:')) {
      return `${value}`;
    }
    if (Array.isArray(value)) {
      const image: string | undefined = value.at(0);
      return !!image ? `${baseUrl}/files/product/${image}` : `./assets/images/no-image.jpg`;
    }

    if (!value) return `./assets/images/no-image.jpg`;

    return `${baseUrl}/files/product/${value}`;
  }
}
