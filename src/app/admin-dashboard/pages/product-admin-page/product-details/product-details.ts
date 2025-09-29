import { Component, computed, inject, input, InputSignal, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarousel } from '@products/components/product-carousel/product-carousel';
import { ProductApi } from '@products/interfaces/product.interface';
import { FormUtils } from '@utils/form-utils';
import { FormErrorLabel } from "@shared/components/form-error-label/form-error-label";
import { ProductService } from '@products/services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'product-details',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './product-details.html'
})
export class ProductDetails implements OnInit {
  private _fb: FormBuilder = inject(FormBuilder);
  private _router: Router = inject(Router);
  private _productService: ProductService = inject(ProductService);

  public product: InputSignal<ProductApi> = input.required<ProductApi>();
  public wasSaved: WritableSignal<boolean> = signal<boolean>(false);
  public tempImages: WritableSignal<string[]> = signal<string[]>([]);
  public imageFiles: Signal<string[]> = computed(() => [...this.product().images, ...this.tempImages()]);
  public imageFileList: FileList | undefined = undefined;
  public productForm = this._fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: ['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price: ['', [Validators.required, Validators.min(0)]],
    stock: ['', [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: ['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]]
  });

  public readonly sizes: string[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  ngOnInit(): void {
    this._setFormValue(this.product());
  }

  private _setFormValue(formLike: Partial<ProductApi>): void {
    this.productForm.reset(this.product() as any);
    this.productForm.patchValue({ tags: formLike.tags?.join(',') }, { emitEvent: false });
  }

  private _showAlertFor(milliseconds: number): void {
    this.wasSaved.set(true);
    setTimeout(() => this.wasSaved.set(false), milliseconds);
  }

  public sizeClicked(size: string): void {
    const currentSizes: string[] = this.productForm.value.sizes ?? [];
    if (currentSizes.includes(size)) {
      currentSizes.splice(currentSizes.indexOf(size), 1);
    }
    else {
      currentSizes.push(size);
    }
    this.productForm.patchValue({ sizes: currentSizes });
  }

  public imageInputChanged(event: Event): void {
    const fileList: FileList | null = (event.target as HTMLInputElement).files;
    this.imageFileList = fileList ?? undefined;
    const imageUrls: string[] = Array.from(fileList ?? []).map((file: File) => URL.createObjectURL(file));
    
    this.tempImages.set(imageUrls);
  }

  public submitForm(): void {
    if (!this.productForm.valid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productLike: Partial<ProductApi> = {
      ...(this.productForm.value as any),
      tags: this.productForm.value.tags?.toLowerCase().split(',').map((tag: string) => tag.trim()) ?? []
    };

    if (this.product().id === 'new') {
      this._productService.createProduct(productLike, this.imageFileList)
        .subscribe((product: ProductApi) => {
          console.log('Producto creado con exito')
          this._router.navigate(['/admin/products/', product.id]);
          this._showAlertFor(2000);
        });
    }
    else {
      this._productService.updateProduct(this.product().id, productLike, this.imageFileList)
        .subscribe(() => {
          console.log('Actualizado con exito');
          this._showAlertFor(2000);
        });
    }
  }
}
