import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html'
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() sortKey = '';
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Input() hasActions = true;

  @Output() sort = new EventEmitter<{ key: string; direction: 'asc' | 'desc' }>();
  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();

  onSort(column: TableColumn): void {
    if (!column.sortable) return;
    
    const direction = this.sortKey === column.key && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sort.emit({ key: column.key, direction });
  }
}
