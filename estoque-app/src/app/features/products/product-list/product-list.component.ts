import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="container">
    <h2>📦 Produtos em Estoque</h2>

    <button routerLink="/products/new">+ Novo Produto</button>

    <table *ngIf="!loading">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Quantidade</th>
          <th>Preço</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let p of products">
          <td>{{ p.name }}</td>
          <td>{{ p.quantity }}</td>
          <td>{{ p.price | currency:'BRL' }}</td>
          <td>
            <button (click)="deleteProduct(p.id!)">Excluir</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p *ngIf="loading">Carregando produtos...</p>
  </div>
  `,
  styles: [`
    .container { padding: 1rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; }
    button { margin-right: 0.5rem; }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.loading = false;
      }
    });
  }

  deleteProduct(id: string) {
    this.productService.deleteProduct(id);
  }
}
