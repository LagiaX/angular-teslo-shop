import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '@auth/interfaces/user.interface';
import { Gender, ProductApi, ProductResponse } from '@products/interfaces/product.interface';
import { forkJoin, map, Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment.development';

const baseUrl: string = environment.baseUrl;

interface Options {
  limit?: number;
  offset?: number;
  gender?: string;
}

const emptyProduct: ProductApi = {
  id: 'new',
  title: '',
  price: 0,
  description: '',
  slug: '',
  stock: 0,
  sizes: [],
  gender: Gender.Kid,
  tags: [],
  images: [],
  user: {} as User
};

@Injectable({ providedIn: 'root' })
export class ProductService {
  private _http: HttpClient = inject(HttpClient);
  private _productsCache: Map<string, ProductResponse> = new Map<string, ProductResponse>();
  private _productDetailCache: Map<string, ProductApi> = new Map<string, ProductApi>();

  public getProducts(options: Options): Observable<ProductResponse> {
    const { limit = 8, offset = 0, gender = '' } = options;

    const key: string = `${limit}-${offset}-${gender}`;
    if (this._productsCache.has(key)) {
      return of(this._productsCache.get(key)!);
    }

    return this._http.get<ProductResponse>(`${baseUrl}/products`, {
      params: {
        limit,
        offset,
        gender
      }
    }).pipe(
      tap((resp: ProductResponse) => this._productsCache.set(key, resp))
    );
  }

  public getProductImage(imageName: string): Observable<string> {
    return this._http.get<string>(`${baseUrl}/files/product/${imageName}`);
  }

  public getProductByIdSlug(idSlug: string): Observable<ProductApi> {
    if (this._productDetailCache.has(idSlug)) {
      return of(this._productDetailCache.get(idSlug)!);
    }
    return this._http.get<ProductApi>(`${baseUrl}/products/${idSlug}`)
      .pipe(
        tap((prod: ProductApi) => this._productDetailCache.set(idSlug, prod))
      );
  }

  public getProductById(id: string): Observable<ProductApi> {
    if (id === 'new') {
      return of(emptyProduct);
    }
    if (this._productDetailCache.has(id)) {
      return of(this._productDetailCache.get(id)!);
    }
    return this._http.get<ProductApi>(`${baseUrl}/products/${id}`)
      .pipe(
        tap((prod: ProductApi) => this._productDetailCache.set(id, prod))
      );
  }

  public createProduct(productLike: Partial<ProductApi>, imageFileList?: FileList): Observable<ProductApi> {
    return this._addImagesToProductLike(productLike, imageFileList).pipe(
      switchMap((productLike: Partial<ProductApi>) =>
        this._http.post<ProductApi>(`${baseUrl}/products`, productLike)
      ),
      tap((product: ProductApi) => this._updateCache(product.id, product))
    );
  }

  public updateProduct(id: string, productLike: Partial<ProductApi>, imageFileList?: FileList): Observable<ProductApi> {
    return this._addImagesToProductLike(productLike, imageFileList).pipe(
      switchMap((productLike: Partial<ProductApi>) =>
        this._http.patch<ProductApi>(`${baseUrl}/products/${id}`, productLike)
      ),
      tap((product: ProductApi) => this._updateCache(id, product))
    );
  }

  public uploadImages(images?: FileList): Observable<string[]> {
    if (!images) return of([]);
    const uploadObservables: Observable<string>[] = Array.from(images).map((image: File) => this.uploadImage(image));
    return forkJoin(uploadObservables);
  }

  public uploadImage(imageFile: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', imageFile);
    return this._http.post<{ fileName: string }>(`${baseUrl}/files/product`, formData).pipe(
      map((resp) => resp.fileName)
    );
  }

  private _addImagesToProductLike(productLike: Partial<ProductApi>, imageFileList?: FileList): Observable<Partial<ProductApi>> {
    const currentImages: string[] = productLike.images ?? [];
    const productLikeWithImages = { ...productLike, images: currentImages };
    if (!imageFileList) {
      return of(productLikeWithImages);
    }
    return this.uploadImages(imageFileList)
      .pipe(
        map((uploadedImages: string[]) => {
          productLikeWithImages.images = productLikeWithImages.images.concat(uploadedImages);
          return productLikeWithImages;
        })
      );
  }

  private _updateCache(id: string, product: ProductApi): void {
    this._productDetailCache.set(id, product);
    this._productsCache.clear();
  }
}
