import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AdminComponent } from './admin/admin.component';
import { UserFormDialogComponent } from './user-form-dialog/user-form-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

const routes: Routes = [{ path: '', component: AdminComponent }];

@NgModule({
  declarations: [AdminComponent, UserFormDialogComponent, ConfirmDialogComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
})
export class AdminModule {}
