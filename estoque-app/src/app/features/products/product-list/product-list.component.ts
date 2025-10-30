import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
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
          <th>Estoque</th>
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
            <button (click)="editProduct(p.id!)" class="btn btn-primary">
              Editar
            </button>
            <button (click)="deleteProduct(p.id!)" class="btn btn-danger">
              Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p *ngIf="loading">Carregando produtos...</p>
    <p *ngIf="!loading && noProductsMessage">{{ noProductsMessage }}</p>
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
  noProductsMessage = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
    next: (data) => {
      console.log('Dados recebidos:', data);
      this.products = data.products;
      this.loading = false;

      if (this.products.length === 0) {
        this.noProductsMessage = 'Nenhum produto registrado no banco de dados.';
      } else {
        this.noProductsMessage = '';
      }
    },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
        this.loading = false;
        this.noProductsMessage = 'Erro ao carregar produtos.';
      }
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          console.log('Produto excluído com sucesso');
          // Atualiza a lista de produtos após exclusão
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (err) => {
          console.error('Erro ao excluir produto:', err);
        }
      });
    }
  }

  editProduct(id: number): void {
  this.router.navigate(['/products/edit', id]);
  }
}
