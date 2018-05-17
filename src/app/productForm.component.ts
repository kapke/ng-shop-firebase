import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';


@Component({
    selector: 'dms-product-form',
    template: `
        <form [formGroup]="form" (ngSubmit)="formSubmitSubject.next()">
            <mat-form-field>
                <label>Name</label>
                <input matInput type="text" [formControlName]="'name'"/>
            </mat-form-field>
            <mat-form-field>
                <label>Price</label>
                <input matInput type="number" min="0" [formControlName]="'price'"/>
            </mat-form-field>
            <mat-form-field>
                <label>Image URL</label>
                <input matInput type="url" [formControlName]="'imageUrl'"/>
            </mat-form-field>
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
    formSubmitSubject = new Subject();

    constructor(private formBuilder: FormBuilder) {
        this.form = formBuilder.group({
            name: ['', Validators.required],
            price: ['', Validators.required],
            imageUrl: ['', Validators.required],
        });

        this.formSubmitSubject
            .pipe(
                filter(() => this.form.valid),
                map(() => this.form.value)
            )
            .subscribe(this.formSubmit);
    }
}
