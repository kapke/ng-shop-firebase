import { Component, Input } from '@angular/core';
import { animate, trigger, state, style, transition } from '@angular/animations';

import { Product } from './Product';


@Component({
    selector: 'dms-product',
    template: `
        <md-card [@state]="state">
            <md-card-title>{{ product.name }}</md-card-title>
            <md-card-subtitle>{{ product.price | currency }}</md-card-subtitle>
            <img md-card-image [src]="product.imageUrl" (load)="imageLoaded()">
        </md-card>
    `,
    styles: [`
        md-card {
            width: 300px;
            overflow: hidden;
        }
    `],
    animations: [
        trigger('state', [
            state('unloaded', style({
                backgroundColor: 'red',
                height: 0,
                padding: 0,
            })),
            state('loaded', style({
            })),
            transition('unloaded => loaded', animate('1000ms ease-in')),
        ])
    ]
})
export class ProductComponent {
    public state: 'loaded'|'unloaded' = 'unloaded';
    @Input() public product: Product;

    imageLoaded () {
        this.state = 'loaded';
    }
}
