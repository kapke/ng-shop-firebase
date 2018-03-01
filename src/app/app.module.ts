import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatInputModule, MatButtonModule, MatCardModule, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { environment } from 'environments/environment';

import { AppComponent } from './app.component';
import { ProductComponent } from './product.component';
import { ProductFormComponent } from './productForm.component';
import { ProductRepository, FireStoreProductRepository } from './ProductRepository';
import { NewProductFormComponent } from './newProductForm.component';


@NgModule({
    declarations: [
        AppComponent,
        ProductComponent,
        ProductFormComponent,
        NewProductFormComponent,
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatSnackBarModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
    ],
    providers: [{provide: ProductRepository, useClass: FireStoreProductRepository}],
    bootstrap: [AppComponent]
})
export class AppModule {}
