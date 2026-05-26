import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { RecordsService } from '../../../core/services/records.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { VerificationRecord } from '../../../core/models/record.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  currentUser!: User;
  dataSource = new MatTableDataSource<VerificationRecord>([]);
  loadingRecords = false;
  delayMs = 0;
  lastDelay = 0;
  totalRecords = 0;

  displayedColumns = [
    'id', 'candidateName', 'checkType', 'status',
    'priority', 'assignedTo', 'createdAt', 'remarks',
  ];

  constructor(
    public auth: AuthService,
    private records: RecordsService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentUser = this.auth.currentUser!;
    this.fetchRecords();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchRecords(): void {
    this.loadingRecords = true;
    this.lastDelay = this.delayMs;

    this.records
      .getRecords(this.delayMs)
      .pipe(finalize(() => (this.loadingRecords = false)))
      .subscribe({
        next: (res) => {
          this.dataSource.data = res.records;
          this.totalRecords = res.total;
          if (res.delay > 0) {
            this.snackBar.open(
              `Records loaded with ${res.delay}ms simulated delay`,
              'OK',
              { duration: 3000 }
            );
          }
        },
        error: () => {
          this.snackBar.open('Failed to load records', 'Close', {
            duration: 4000,
            panelClass: 'snack-error',
          });
        },
      });
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  logout(): void {
    this.auth.logout();
  }

  formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }
}
