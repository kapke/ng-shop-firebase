import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatSnackBar } from '@angular/material';

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
            .retryWhen((errors) => errors
                .map(err => {
                    if (err instanceof Error) {
                        return err.message;
                    } else if (err.status && err.statusText && err.url) {
                        return err.json().error;
                    } else {
                        return '';
                    }
                })
                .concatMap((err, index) => Observable.of(err).delay(1000 * 2 ** index))
                .scan(({count}, message) => {
                    if (count === 0) {
                        throw message;
                    } else {
                        return {count: count - 1, message};
                    }
                }, {count: 5, message: ''})
                .do(({count, message }) => {
                    const msg = message ? ': ' + message : '';
                    this.snackBar.open(
                        `There was an error when trying to add a new product${msg}. ${count} retries left`,
                        'OK',
                        {duration: 5000},
                    );
                }))
            .subscribe(undefined, undefined, () => this.snackBar.open('Added new product!', 'OK', {duration: 5000}));
    }
}
