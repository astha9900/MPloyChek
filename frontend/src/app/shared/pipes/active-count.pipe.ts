import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../core/models/user.model';

@Pipe({ name: 'activeCount' })
export class ActiveCountPipe implements PipeTransform {
  transform(users: User[]): number {
    return users.filter((u) => u.status === 'Active').length;
  }
}
