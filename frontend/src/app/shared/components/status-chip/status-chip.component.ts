import { Component, Input } from '@angular/core';

type ChipColor = 'success' | 'warning' | 'error' | 'info' | 'default';

const STATUS_COLOR_MAP: Record<string, ChipColor> = {
  Completed: 'success',
  'In Progress': 'warning',
  Pending: 'info',
  Failed: 'error',
  Active: 'success',
  Inactive: 'default',
  Admin: 'warning',
  'General User': 'info',
  High: 'error',
  Medium: 'warning',
  Low: 'success',
};

@Component({
  selector: 'app-status-chip',
  template: `<span class="chip chip--{{color}}">{{ label }}</span>`,
  styles: [`
    .chip {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.3px;
    }
    .chip--success { background: #e8f5e9; color: #2e7d32; }
    .chip--warning { background: #fff8e1; color: #f57f17; }
    .chip--error   { background: #ffebee; color: #c62828; }
    .chip--info    { background: #e3f2fd; color: #1565c0; }
    .chip--default { background: #f5f5f5; color: #616161; }
  `],
})
export class StatusChipComponent {
  @Input() label = '';
  get color(): ChipColor {
    return STATUS_COLOR_MAP[this.label] ?? 'default';
  }
}
