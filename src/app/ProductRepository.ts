import { Injectable } from '@angular/core';
import { DocumentSnapshot } from '@firebase/firestore-types';
import { AngularFirestore } from 'angularfire2/firestore';
import { List } from 'immutable';
import { Observable, from } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

import { Product } from './Product';


export abstract class ProductRepository {
    abstract productList$: Observable<List<Product>>;

    abstract getAll (): Observable<List<Product>>;
    abstract add (product: Product): Observable<Product>;
    abstract delete (product: Product): Observable<void>;
}

@Injectable()
export class FireStoreProductRepository extends ProductRepository {
    private products = this.fs.collection<Product>('products');

    public productList$ = this.products.snapshotChanges().pipe(
        map(actions => actions
            .map(a => a.payload.doc)
            .map(this.documentToProduct)
        ),
        map(products => List(products)),
    );

    constructor (private fs: AngularFirestore) {
        super();
    }

    public add(product: Product): Observable<Product> {
        return from(this.products.add(product)).pipe(
            mergeMap(docRef => docRef.get()),
            map(this.documentToProduct),
        );
    }

    public delete(product: Product): Observable<void> {
        return from(this.fs.doc(`products/${product.id}`).delete());
    }

    public getAll(): Observable<List<Product>> {
        return this.productList$.pipe(take(1));
    }

    private documentToProduct = (doc: DocumentSnapshot): Product => new Product({...doc.data(), id: doc.id });
}
