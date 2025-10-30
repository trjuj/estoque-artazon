import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
  <div class="container">
    <h2>Novo Produto</h2>

    <form (ngSubmit)="saveProduct()">
      <label>Nome:</label>
      <input type="text" [(ngModel)]="product.name" name="name" required>

      <label>Quantidade:</label>
      <input type="number" [(ngModel)]="product.quantity" name="quantity" required>

      <label>Preço:</label>
      <input type="number" [(ngModel)]="product.price" name="price" required>

      <button type="submit">Salvar</button>
      <button type="button" routerLink="/products">Cancelar</button>
    </form>
  </div>
  `,
  styles: [`
    .container { padding: 1rem; display: flex; flex-direction: column; max-width: 400px; }
    form { display: flex; flex-direction: column; gap: 0.5rem; }
    input { padding: 0.4rem; border-radius: 4px; border: 1px solid #ccc; }
  `]
})
export class ProductFormComponent {
  product: Product = { name: '', price: 0, quantity: 0, set_name: '', description: '', image_url: '' };

  constructor(private productService: ProductService, private router: Router) {}

  saveProduct() {
    this.productService.addProduct(this.product)
    .subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err: any) => console.error('Erro ao salvar produto:', err)
    });
  }
}
