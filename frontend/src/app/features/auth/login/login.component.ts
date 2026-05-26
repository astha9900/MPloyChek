import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  hidePassword = true;
  detectedRole = '';

  readonly demoAccounts = [
    { username: 'astha.admin', role: 'Admin', hint: 'Admin account' },
    { username: 'surbhi.user', role: 'General User', hint: 'General User account' },
  ];

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.loginForm.get('username')!.valueChanges.subscribe((val: string) => {
      if (val?.includes('admin')) this.detectedRole = 'Admin';
      else if (val?.includes('user')) this.detectedRole = 'General User';
      else this.detectedRole = '';
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) return;
    this.loading = true;

    this.auth
      .login(this.loginForm.value)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res) => {
          this.snackBar.open(`Welcome back, ${res.user.name}!`, 'Close', { duration: 3000 });
          const target = res.user.role === 'Admin' ? '/admin' : '/dashboard';
          this.router.navigate([target]);
        },
        error: (err) => {
          const msg = err.error?.message || 'Login failed. Please try again.';
          this.snackBar.open(msg, 'Close', { duration: 4000, panelClass: 'snack-error' });
        },
      });
  }

  fillDemo(account: { username: string; role: string }): void {
    this.loginForm.patchValue({ username: account.username, password: 'Pass@1234' });
  }
}
