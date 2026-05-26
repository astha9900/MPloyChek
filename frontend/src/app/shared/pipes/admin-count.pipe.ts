import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../core/models/user.model';

@Pipe({ name: 'adminCount' })
export class AdminCountPipe implements PipeTransform {
  transform(users: User[]): number {
    return users.filter((u) => u.role === 'Admin').length;
  }
}
