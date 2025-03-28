import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';


export interface Product {
    id?: string;
    code?: string;
    name?: string;
    description?: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: string;
    category?: string;
    image?: string;
    rating?: number;
}

@Injectable()
export class ProductService {
    private apiUrl = 'http://localhost:8000/api/products/';
    constructor(private http: HttpClient) { }

    getProductsData(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl).pipe(
          catchError(error => {
            console.error('Error fetching products:', error);
            return of([]);  // Return an empty array in case of error
          })
        );
      }

    addProduct(productData: any): Observable<any> {
    return this.http.post(this.apiUrl, productData);
    }
    

    status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];




    getProductsMini() {
        return this.getProductsData().pipe(
            map((products: Product[]) => products.slice(0, 5)) // Explicitly type 'products' as Product[]
        );
    }
    
    getProductsSmall() {
        return this.getProductsData().pipe(
            map((products: Product[]) => products.slice(0, 10)) // Explicitly type 'products' as Product[]
        );
    }
    getProducts() {
        return Promise.resolve(this.getProductsData());
    }


}