import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { List } from 'immutable';

import { ProductRepository } from './ProductRepository';
import { Product } from './Product';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatSnackBar } from '@angular/material';

@Component({
    selector: 'dms-root',
    template: `
        <dms-new-product-form></dms-new-product-form>
        <div class="products">
            <dms-product
                *ngFor="let product of products$ | async; trackBy: productId"
                [@slide]="'in'"
                [product]="product">
                <button mat-button (click)="deleteProduct(product)">Delete</button>
            </dms-product>
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
    animations: [
        trigger('slide', [
            state('in', style({
                opacity: 1,
                transform: 'translateY(0)'
            })),
            transition(':enter', [style({opacity: 0, transform: 'translateY(-100%)'}), animate('200ms ease-in')]),
            transition(':leave', [animate('200ms ease-in', style({opacity: 0, transform: 'translateY(100%)'}) ), ]),
        ])
    ]
})
export class AppComponent {
    public products$: Observable<List<Product>>;

    constructor (snackBar: MatSnackBar, private productRepository: ProductRepository) {
        this.products$ = this.productRepository.fancyFindAll()
            .catch((err): Observable<List<Product>> => {
                snackBar.open(err.message || 'There was an error when fetching data');
                return Observable.of<List<Product>>(List<Product>());
            })
            .concat(this.productRepository.productList$);
    }

    public productId (index: number, product: Product): string {
        return product.id;
    }

    public deleteProduct (product: Product): void {
        this.productRepository.delete(product);
    }
}
