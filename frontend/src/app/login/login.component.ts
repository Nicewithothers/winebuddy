import { Component } from '@angular/core';
import {AuthRequest} from '../../shared/models/authrequest.model';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  credentials: AuthRequest = {username: '', password: ''};
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
  }

  onSubmit(): void {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
      }
    })
  }
}
