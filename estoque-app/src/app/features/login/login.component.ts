import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
  <div class="login-container">
    <h2>Login</h2>
    <form (ngSubmit)="login()">
      <input type="email" [(ngModel)]="email" name="email" placeholder="Email" required>
      <input type="password" [(ngModel)]="password" name="password" placeholder="Senha" required>
      <button type="submit">Entrar</button>
    </form>
    <p *ngIf="errorMessage" style="color:red">{{ errorMessage }}</p>
  </div>
  `,
  styles: [`
    .login-container { padding:1rem; max-width:300px; margin:auto; display:flex; flex-direction:column; gap:0.5rem; }
    input { padding:0.5rem; border-radius:4px; border:1px solid #ccc; }
    button { padding:0.5rem; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.email, this.password)
      .then(() => this.router.navigate(['/products']))
      .catch(err => this.errorMessage = 'Email ou senha inválidos.');
  }
}
