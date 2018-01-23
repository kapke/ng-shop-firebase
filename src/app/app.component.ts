import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { List } from 'immutable';
import { MatSnackBar } from '@angular/material';
import {
    trigger,
    state,
    style,
    transition,
    animate
} from '@angular/animations';
import { switchMap, scan, catchError, concat, concatMap, delay, retry } from 'rxjs/operators';
import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';

import { ProductRepository } from './ProductRepository';
import { Product } from './Product';

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
    styles: [
        `
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
    `
    ],
    animations: [
        trigger('slide', [
            state(
                'in',
                style({
                    opacity: 1,
                    transform: 'translateY(0)'
                })
            ),
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(-100%)' }),
                animate('200ms ease-in')
            ]),
            transition(':leave', [
                animate(
                    '200ms ease-in',
                    style({ opacity: 0, transform: 'translateY(100%)' })
                )
            ])
        ])
    ]
})
export class AppComponent {
    public products$: Observable<List<Product>>;

    constructor(
        private snackBar: MatSnackBar,
        private productRepository: ProductRepository
    ) {
        this.products$ = this.productRepository.getAll().pipe(
            switchMap(products => from(products.toArray()).pipe(
                concatMap(product => of(product).pipe(delay(50)))
            )),
            scan<Product, List<Product>>((list, product) => list.push(product), List()),
            catchError((err): Observable<List<Product>> => {
                snackBar.open(
                    err.message || 'There was an error when fetching data'
                );
                return of(List());
            }),
            concat(this.productRepository.productList$)
        );
    }

    public productId(index: number, product: Product): string {
        return product.id;
    }

    public deleteProduct(product: Product): void {
        this.productRepository
            .delete(product)
            .pipe(retry(5))
            .subscribe(undefined, () => {
                this.snackBar.open(`Unable to delete ${product.name}`, 'OK', {
                    duration: 5000
                });
            });
    }
}
