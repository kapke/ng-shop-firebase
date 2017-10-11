import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Product, ProductData } from './Product';


@Component({
    selector: 'dms-product-form',
    template: `
        <form [formGroup]="form" (ngSubmit)="submitForm()">
            <md-input-container>
                <label>Name</label>
                <input mdInput type="text" [formControlName]="'name'" />
            </md-input-container>
            <md-input-container>
                <label>Price</label>
                <input mdInput type="number" min="0" [formControlName]="'price'" />
            </md-input-container>
            <md-input-container>
                <label>Image URL</label>
                <input mdInput type="url" [formControlName]="'imageUrl'" />
            </md-input-container>
            <div>
                <button type="reset" md-button>Reset</button>
                <button type="submit" md-button [disabled]="form.invalid">{{ submitButtonText }}</button>
            </div>
        </form>
    `
})
export class ProductFormComponent {
    @Input() public submitButtonText = 'Submit';
    public form: FormGroup;

    @Output() formSubmit = new EventEmitter();

    constructor (private formBuilder: FormBuilder) {
        this.form = formBuilder.group({
            name: ['', Validators.required],
            price: ['', Validators.required],
            imageUrl: ['', Validators.required],
        });
    }

    public submitForm () {
        if (this.form.valid) {
            this.formSubmit.next(new Product(this.form.value as ProductData));
        }
    }
}
