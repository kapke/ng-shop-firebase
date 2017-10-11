import { Component, Inject } from '@angular/core';

import { Product } from './Product';
import { ProductRepository } from './ProductRepository';


@Component({
    selector: 'dms-new-product-form',
    template: `
        <dms-product-form (formSubmit)="addProduct($event)" [submitButtonText]="'Add product'"></dms-product-form>
    `
})
export class NewProductFormComponent {
    constructor (private productRepository: ProductRepository) {}

    addProduct (product: Product) {
        this.productRepository.add(product)
            .subscribe(product => console.log(product));
    }
}
