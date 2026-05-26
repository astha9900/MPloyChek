import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { UserFormDialogComponent } from '../user-form-dialog/user-form-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<User>([]);
  loading = false;
  displayedColumns = ['name', 'username', 'role', 'email', 'department', 'status', 'createdAt', 'actions'];

  constructor(
    public auth: AuthService,
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (users) => (this.dataSource.data = users),
        error: () => this.snackBar.open('Failed to load users', 'Close', { duration: 3000 }),
      });
  }

  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(UserFormDialogComponent, {
      width: '480px',
      data: { user: null },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.loadUsers();
    });
  }

  openEditDialog(user: User): void {
    const ref = this.dialog.open(UserFormDialogComponent, {
      width: '480px',
      data: { user },
    });
    ref.afterClosed().subscribe((result) => {
      if (result) this.loadUsers();
    });
  }

  confirmDelete(user: User): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: { name: user.name },
    });
    ref.afterClosed().subscribe((confirmed) => {
      if (confirmed) this.deleteUser(user.id);
    });
  }

  private deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
        this.loadUsers();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Failed to delete user', 'Close', { duration: 3000 });
      },
    });
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }

  logout(): void {
    this.auth.logout();
  }
}
