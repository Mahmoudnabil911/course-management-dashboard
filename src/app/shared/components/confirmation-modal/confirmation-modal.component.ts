import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div (click)="onCancel()" class="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"></div>
        
        <!-- Modal Wrapper -->
        <div class="relative bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full shadow-2xl p-6 overflow-hidden animate-fade-in">
          <div class="flex items-start gap-4">
            <!-- Alert Icon -->
            <div class="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center flex-shrink-0 text-rose-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-slate-100">{{ title }}</h3>
              <p class="mt-2 text-sm text-slate-400 leading-relaxed">{{ message }}</p>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end gap-3">
            <button 
              (click)="onCancel()" 
              type="button" 
              class="px-4 py-2 text-sm font-medium text-slate-300 hover:text-slate-100 bg-slate-700 hover:bg-slate-650 border border-slate-650 rounded-xl transition-all cursor-pointer"
            >
              {{ cancelText }}
            </button>
            <button 
              (click)="onConfirm()" 
              type="button" 
              class="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-500 border border-rose-600 rounded-xl shadow-lg shadow-rose-900/20 hover:shadow-rose-900/30 transition-all cursor-pointer"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmationModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to perform this action? This cannot be undone.';
  @Input() confirmText = 'Confirm';
  @Input() cancelText = 'Cancel';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
