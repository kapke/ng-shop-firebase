import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MatInputModule, MatButtonModule, MatCardModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ProductComponent } from './product.component';
import { ProductFormComponent } from './productForm.component';
import { HttpFireBaseProductRepository, ProductRepository } from './ProductRepository';
import { NewProductFormComponent } from './newProductForm.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

console.log(ProductRepository, HttpFireBaseProductRepository)

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
    ],
    providers: [{provide: ProductRepository, useClass: HttpFireBaseProductRepository}],
    bootstrap: [AppComponent]
})
export class AppModule {}
