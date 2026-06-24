import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private nextId = 1;
  readonly toasts = signal<Toast[]>([]);

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 3000): void {
    const id = this.nextId++;
    const toast: Toast = { id, message, type, duration };
    
    this.toasts.update(current => [...current, toast]);

    setTimeout(() => {
      this.dismiss(id);
    }, duration);
  }

  success(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 4000): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 3500): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = 3000): void {
    this.show(message, 'info', duration);
  }

  dismiss(id: number): void {
    this.toasts.update(current => current.filter(toast => toast.id !== id));
  }
}
