import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatInputModule, MatButtonModule, MatCardModule, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { environment } from 'environments/environment';

import { AppComponent } from './app.component';
import { ProductComponent } from './product.component';
import { ProductFormComponent } from './productForm.component';
import { HttpFireBaseProductRepository, ProductRepository, FireBaseProductRepository } from './ProductRepository';
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
        AngularFireDatabaseModule,
    ],
    providers: [{provide: ProductRepository, useClass: FireBaseProductRepository}],
    bootstrap: [AppComponent]
})
export class AppModule {}
