import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Product } from './Product';


@Component({
    selector: 'dms-product-form',
    template: `
        <form [formGroup]="form" (ngSubmit)="submitForm()">
            <mat-input-container>
                <label>Name</label>
                <input matInput type="text" [formControlName]="'name'" />
            </mat-input-container>
            <mat-input-container>
                <label>Price</label>
                <input matInput type="number" min="0" [formControlName]="'price'" />
            </mat-input-container>
            <mat-input-container>
                <label>Image URL</label>
                <input matInput type="url" [formControlName]="'imageUrl'" />
            </mat-input-container>
            <div>
                <button type="reset" mat-button>Reset</button>
                <button type="submit" mat-button [disabled]="form.invalid">{{ submitButtonText }}</button>
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
            this.formSubmit.next(new Product(this.form.value));
        }
    }
}
