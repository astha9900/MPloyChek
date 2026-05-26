import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

interface DialogData { user: User | null; }

@Component({
  selector: 'app-user-form-dialog',
  templateUrl: './user-form-dialog.component.html',
  styleUrls: ['./user-form-dialog.component.scss'],
})
export class UserFormDialogComponent implements OnInit {
  form!: FormGroup;
  saving = false;
  isEdit: boolean;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<UserFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.isEdit = !!data.user;
  }

  ngOnInit(): void {
    const u = this.data.user;
    this.form = this.fb.group({
      name: [u?.name || '', [Validators.required, Validators.minLength(2)]],
      username: [u?.username || '', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-z0-9._-]+$/)]],
      email: [u?.email || '', [Validators.required, Validators.email]],
      password: [
        '',
        this.isEdit ? [] : [Validators.required, Validators.minLength(6)],
      ],
      role: [u?.role || 'General User', Validators.required],
      department: [u?.department || ''],
      phone: [u?.phone || ''],
      status: [u?.status || 'Active', Validators.required],
    });

    if (this.isEdit) {
      this.form.get('username')!.disable();
    }
  }

  onSave(): void {
    if (this.form.invalid || this.saving) return;
    this.saving = true;

    const payload = this.form.getRawValue();
    if (this.isEdit && !payload.password) delete payload.password;

    const request = this.isEdit
      ? this.userService.updateUser(this.data.user!.id, payload)
      : this.userService.createUser(payload);

    request.pipe(finalize(() => (this.saving = false))).subscribe({
      next: () => {
        this.snackBar.open(
          `User ${this.isEdit ? 'updated' : 'created'} successfully`,
          'Close',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Operation failed', 'Close', { duration: 3000 });
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
