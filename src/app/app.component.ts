import { Component } from '@angular/core';
import { ProductRepository } from './ProductRepository';
import { Observable } from 'rxjs';
import { List } from 'immutable';
import { Product } from './Product';

@Component({
    selector: 'dms-root',
    template: `
        <dms-product *ngFor="let product of products | async" [product]="product"></dms-product>
        <dms-new-product-form></dms-new-product-form>
    `,
    styles: [`
        :host {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }
    `]
})
export class AppComponent {
    public products: Observable<List<Product>>;

    constructor (private productRepository: ProductRepository) {
        this.products = this.productRepository.findAll();
    }
}
