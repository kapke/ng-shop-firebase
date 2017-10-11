import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { List } from 'immutable';

import { ProductRepository } from './ProductRepository';
import { Product } from './Product';

@Component({
    selector: 'dms-root',
    template: `
        <dms-new-product-form></dms-new-product-form>
        <div class="products">
            <dms-product
                *ngFor="let product of products$ | async; trackBy: productId"
                [product]="product"></dms-product>
        </div>
    `,
    styles: [`
        :host {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
        }
        
        .products {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }
    `],
})
export class AppComponent {
    public products$: Observable<List<Product>>;

    constructor (private productRepository: ProductRepository) {
        this.products$ = this.productRepository.fancyFindAll().concat(this.productRepository.productList$);

        this.products$.subscribe(products => console.log(products), null, () => console.log('complete'));
    }

    public productId (index: number, product: Product): string {
        return product.id;
    }
}
