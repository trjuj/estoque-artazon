import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  id?: number;
  name: string;
  set_name: string;
  product_type: string;
  price: number;
  quantity: number;
  description: string;
  image_url: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = 'http://127.0.0.1:5000/api'; // URL da sua API Flask

  constructor(private http: HttpClient) {}

  getProducts(): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(`${this.apiUrl}/products`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/product`, product, { headers: { 'Content-Type': 'application/json' } });
  }

  updateProduct(product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/product/${product.id}`, product, { headers: { 'Content-Type': 'application/json' } });
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/product/${id}`, { headers: { 'Content-Type': 'application/json' } });
  }

  getProductById(id: number): Observable<Product> {
  return this.http.get<Product>(`${this.apiUrl}/product/${id}`);
  }
}