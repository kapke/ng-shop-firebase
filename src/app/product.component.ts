import { Component, Input } from '@angular/core';
import { animate, trigger, state, style, transition } from '@angular/animations';

import { Product } from './Product';


@Component({
    selector: 'dms-product',
    template: `
        <mat-card [@state]="state">
            <img mat-card-image [src]="product.imageUrl" (load)="imageLoaded()">
            <mat-card-title>{{ product.name }}</mat-card-title>
            <mat-card-subtitle>{{ product.price | currency }}</mat-card-subtitle>
            <mat-card-actions>
                <ng-content></ng-content>
            </mat-card-actions>
        </mat-card>
    `,
    styles: [`
        :host {
            margin: 1em;
            display: block;
        }
        
        mat-card {
            width: 300px;
            overflow: hidden;
        }
    `],
    animations: [
        trigger('state', [
            state('loaded',
                style({height: '*'})),
            state('unloaded',
                style({height: 0})),
            transition('unloaded => loaded', [animate('200ms ease-in')]),
        ])
    ]
})
export class ProductComponent {
    public state: 'loaded'|'unloaded' = 'unloaded';
    @Input() public product!: Product;

    imageLoaded () {
        this.state = 'loaded';
    }
}
