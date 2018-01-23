import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';
import { retryWhen, map, concatMap, scan, tap } from 'rxjs/operators';

import { Product } from './Product';
import { ProductRepository } from './ProductRepository';


@Component({
    selector: 'dms-new-product-form',
    template: `
        <dms-product-form (formSubmit)="addProduct($event)" [submitButtonText]="'Add product'"></dms-product-form>
    `
})
export class NewProductFormComponent {
    constructor (private snackBar: MatSnackBar, private productRepository: ProductRepository) {}

    addProduct (product: Product) {
        this.productRepository.add(product)
            .pipe(
                retryWhen((errors) => errors.pipe(
                    map(err => {
                        if (err instanceof Error) {
                            return err.message;
                        } else if (err.status && err.statusText && err.url) {
                            return err.json().error;
                        } else {
                            return '';
                        }
                    }),
                    concatMap((err, index) => Observable.of(err).delay(1000 * 2 ** index)),
                    scan<string, {count: number; message: string}>(({count}, message) => {
                        if (count === 0) {
                            throw message;
                        } else {
                            return {count: count - 1, message};
                        }
                    }, {count: 5, message: ''}),
                    tap(({count, message }) => {
                        const msg = message ? ': ' + message : '';
                        this.snackBar.open(
                            `There was an error when trying to add a new product${msg}. ${count} retries left`,
                            'OK',
                            {duration: 5000},
                        );
                    }),
                ))
            )
            .subscribe(undefined, undefined, () => this.snackBar.open('Added new product!', 'OK', {duration: 5000}));
    }
}
