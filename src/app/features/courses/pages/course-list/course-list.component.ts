import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Course } from '../../models/course.model';
import { TableComponent, TableColumn } from '../../../../shared/components/table/table.component';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    TableComponent,
    SkeletonLoaderComponent,
    ConfirmationModalComponent
  ],
  template: `
    <div class="space-y-8 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-100 tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Courses Dashboard
          </h1>
          <p class="text-slate-400 mt-1 text-sm">
            Manage, filter, and organize educational programs effortlessly.
          </p>
        </div>
        <a 
          routerLink="/courses/new" 
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/40 transition-all cursor-pointer"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Add Course
        </a>
      </div>

      <!-- Filters Toolbar -->
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-slate-800/40 border border-slate-700/60 rounded-2xl backdrop-blur-md">
        <!-- Search and Status -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
          <!-- Search input -->
          <div class="relative flex-1">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </span>
            <input 
              [(ngModel)]="searchQuery" 
              type="text" 
              placeholder="Search by course name or instructor..." 
              class="w-full pl-10 pr-4 py-2.5 bg-slate-900/65 border border-slate-750 focus:border-indigo-500 rounded-xl text-slate-100 placeholder-slate-500 outline-none text-sm transition-all focus:ring-2 focus:ring-indigo-500/25"
            />
          </div>

          <!-- Status Filter -->
          <select 
            [(ngModel)]="statusFilter"
            class="px-4 py-2.5 bg-slate-900/65 border border-slate-750 focus:border-indigo-500 rounded-xl text-slate-100 outline-none text-sm transition-all focus:ring-2 focus:ring-indigo-500/25 min-w-[140px]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>

          <!-- Category Filter -->
          <select 
            [(ngModel)]="categoryFilter"
            class="px-4 py-2.5 bg-slate-900/65 border border-slate-750 focus:border-indigo-500 rounded-xl text-slate-100 outline-none text-sm transition-all focus:ring-2 focus:ring-indigo-500/25 min-w-[150px]"
          >
            <option value="All">All Categories</option>
            @for (cat of categories(); track cat) {
              <option [value]="cat">{{ cat }}</option>
            }
          </select>
        </div>

        <!-- View Mode switch & Info -->
        <div class="flex items-center justify-between lg:justify-end gap-6 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-700/60">
          <span class="text-xs text-slate-400 font-medium uppercase tracking-wider">
            Total: {{ filteredCourses().length }} courses
          </span>

          <div class="flex bg-slate-900/60 p-1 border border-slate-750 rounded-xl">
            <button 
              (click)="viewMode.set('table')" 
              [class.bg-slate-700]="viewMode() === 'table'"
              [class.text-indigo-400]="viewMode() === 'table'"
              class="p-2 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              title="Table View"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </button>
            <button 
              (click)="viewMode.set('grid')" 
              [class.bg-slate-700]="viewMode() === 'grid'"
              [class.text-indigo-400]="viewMode() === 'grid'"
              class="p-2 rounded-lg text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              title="Grid View"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Content State -->
      @if (isLoading()) {
        <app-skeleton-loader [type]="viewMode() === 'table' ? 'table' : 'card'"></app-skeleton-loader>
      } @else if (errorState()) {
        <!-- Error State -->
        <div class="flex flex-col items-center justify-center py-16 px-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
          <div class="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 animate-bounce">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <h3 class="text-lg font-semibold text-slate-200">Failed to load courses</h3>
          <p class="text-sm text-slate-400 mt-2 max-w-md text-center">{{ errorState() }}</p>
          <button (click)="loadCourses()" class="mt-5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-600 rounded-xl cursor-pointer shadow-md">
            Retry Connection
          </button>
        </div>
      } @else if (filteredCourses().length === 0) {
        <!-- Empty State -->
        <div class="flex flex-col items-center justify-center py-16 px-4 bg-slate-800/20 border border-slate-700/40 rounded-2xl">
          <div class="w-12 h-12 rounded-full bg-slate-700/30 border border-slate-700/50 flex items-center justify-center text-slate-400 mb-4">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h3 class="text-lg font-semibold text-slate-350">No courses found</h3>
          <p class="text-sm text-slate-400 mt-1">Try adjusting your filters or search query.</p>
        </div>
      } @else {
        <!-- Table View -->
        @if (viewMode() === 'table') {
          <div class="space-y-4">
            <app-table
              [data]="paginatedCourses()"
              [columns]="columns"
              [sortKey]="sortKey()"
              [sortDirection]="sortDirection()"
              (sort)="onSort($event)"
              (view)="onView($event)"
              (edit)="onEdit($event)"
              (delete)="onDeletePrompt($event)"
            ></app-table>
          </div>
        } @else {
          <!-- Grid/Card View -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (course of paginatedCourses(); track course.id) {
              <div class="bg-slate-850 hover:bg-slate-800 border border-slate-750/70 hover:border-slate-650 hover:scale-[1.01] rounded-2xl p-6 flex flex-col justify-between shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group">
                <!-- Status Badge -->
                <div class="absolute top-4 right-4">
                  <span 
                    [ngClass]="{
                      'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20': course.status === 'Active',
                      'bg-amber-500/10 text-amber-400 border border-amber-500/20': course.status === 'Draft',
                      'bg-slate-500/10 text-slate-400 border border-slate-500/20': course.status === 'Archived'
                    }"
                    class="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider inline-flex"
                  >
                    {{ course.status }}
                  </span>
                </div>

                <div class="space-y-3">
                  <span class="text-xs font-semibold text-indigo-400 tracking-wider uppercase bg-indigo-500/10 border border-indigo-500/10 px-2.5 py-1 rounded-lg inline-block">
                    {{ course.category }}
                  </span>
                  
                  <h3 class="text-lg font-bold text-slate-100 group-hover:text-white transition-colors line-clamp-1">
                    {{ course.courseName }}
                  </h3>
                  
                  <p class="text-slate-400 text-xs flex items-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    By {{ course.instructorName }}
                  </p>

                  <p class="text-slate-400 text-sm line-clamp-2 leading-relaxed min-h-[40px]">
                    {{ course.description || 'No description provided.' }}
                  </p>
                </div>

                <!-- Footer Card details -->
                <div class="mt-6 pt-4 border-t border-slate-750 flex items-center justify-between">
                  <div class="flex flex-col">
                    <span class="text-[10px] text-slate-500 uppercase font-semibold">Price</span>
                    <span class="text-lg font-extrabold text-slate-150">{{ course.price | currency:'USD':'symbol':'1.0-2' }}</span>
                  </div>
                  <div class="flex flex-col items-end">
                    <span class="text-[10px] text-slate-500 uppercase font-semibold">Duration</span>
                    <span class="text-sm font-semibold text-slate-350">{{ course.duration }} hrs</span>
                  </div>
                </div>

                <!-- Hover action buttons -->
                <div class="mt-5 flex gap-2 w-full">
                  <button 
                    (click)="onView(course)" 
                    class="flex-1 py-2 text-center text-xs font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/10 rounded-xl transition-all cursor-pointer"
                  >
                    View
                  </button>
                  <button 
                    (click)="onEdit(course)" 
                    class="flex-1 py-2 text-center text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/10 rounded-xl transition-all cursor-pointer"
                  >
                    Edit
                  </button>
                  <button 
                    (click)="onDeletePrompt(course)" 
                    class="py-2 px-3 text-center text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/10 rounded-xl transition-all cursor-pointer"
                  >
                    <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            }
          </div>
        }

        <!-- Pagination Controls -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-800/20 border border-slate-700/40 rounded-2xl">
          <div class="flex items-center gap-2">
            <span class="text-xs text-slate-400">Rows per page:</span>
            <select 
              [(ngModel)]="pageSize"
              (ngModelChange)="currentPage.set(1)"
              class="px-2 py-1 bg-slate-900 border border-slate-750 rounded-lg text-slate-350 outline-none text-xs"
            >
              <option [value]="5">5</option>
              <option [value]="10">10</option>
              <option [value]="20">20</option>
            </select>
          </div>

          <div class="flex items-center gap-1.5">
            <button 
              (click)="goToPage(1)"
              [disabled]="currentPage() === 1"
              class="p-1.5 rounded-lg border border-slate-700/50 hover:bg-slate-750 disabled:opacity-30 disabled:pointer-events-none transition-colors text-slate-350 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
            </button>
            <button 
              (click)="goToPage(currentPage() - 1)"
              [disabled]="currentPage() === 1"
              class="p-1.5 rounded-lg border border-slate-700/50 hover:bg-slate-750 disabled:opacity-30 disabled:pointer-events-none transition-colors text-slate-350 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            
            <span class="text-xs text-slate-400 px-2">
              Page <span class="font-semibold text-slate-200">{{ currentPage() }}</span> of <span class="font-semibold text-slate-200">{{ totalPages() }}</span>
            </span>

            <button 
              (click)="goToPage(currentPage() + 1)"
              [disabled]="currentPage() === totalPages()"
              class="p-1.5 rounded-lg border border-slate-700/50 hover:bg-slate-750 disabled:opacity-30 disabled:pointer-events-none transition-colors text-slate-350 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
            <button 
              (click)="goToPage(totalPages())"
              [disabled]="currentPage() === totalPages()"
              class="p-1.5 rounded-lg border border-slate-700/50 hover:bg-slate-750 disabled:opacity-30 disabled:pointer-events-none transition-colors text-slate-350 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      }
    </div>

    <!-- Confirmation Modal for Deletion -->
    <app-confirmation-modal
      [isOpen]="isDeleteModalOpen()"
      title="Delete Course"
      [message]="deleteModalMessage()"
      confirmText="Delete"
      cancelText="Cancel"
      (confirm)="onConfirmDelete()"
      (cancel)="onCancelDelete()"
    ></app-confirmation-modal>
  `
})
export class CourseListComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  // States
  readonly courses = signal<Course[]>([]);
  readonly isLoading = signal(true);
  readonly errorState = signal<string | null>(null);

  // Filters and pagination
  readonly searchQuery = signal('');
  readonly statusFilter = signal<string>('All');
  readonly categoryFilter = signal<string>('All');
  readonly viewMode = signal<'table' | 'grid'>('table');
  readonly currentPage = signal(1);
  readonly pageSize = signal(5);

  // Sorting
  readonly sortKey = signal<string>('courseName');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');

  // Deletion Modal details
  readonly isDeleteModalOpen = signal(false);
  readonly courseToDelete = signal<Course | null>(null);
  readonly deleteModalMessage = computed(() => {
    const course = this.courseToDelete();
    return course 
      ? `Are you sure you want to delete the course "${course.courseName}"? This action cannot be undone.`
      : '';
  });

  // Table Columns config
  readonly columns: TableColumn[] = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'courseName', label: 'Course Name', sortable: true },
    { key: 'instructorName', label: 'Instructor', sortable: true },
    { key: 'category', label: 'Category', sortable: true },
    { key: 'duration', label: 'Duration', sortable: true },
    { key: 'price', label: 'Price', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'createdDate', label: 'Created Date', sortable: true }
  ];

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.errorState.set(null);
    this.courseService.getCourses().subscribe({
      next: (data) => {
        this.courses.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorState.set(err.message || 'Error occurred while loading courses.');
        this.isLoading.set(false);
        this.toastService.error('Connection to JSON server failed.');
      }
    });
  }

  // Categories computed list for filter dropdown
  readonly categories = computed(() => {
    const allCats = this.courses().map(c => c.category);
    return Array.from(new Set(allCats)).sort();
  });

  // Client-side filtering & sorting
  readonly filteredCourses = computed(() => {
    let result = [...this.courses()];

    // Search query filter (course name or instructor)
    const query = this.searchQuery().toLowerCase().trim();
    if (query) {
      result = result.filter(
        c => c.courseName.toLowerCase().includes(query) || 
             c.instructorName.toLowerCase().includes(query)
      );
    }

    // Status filter
    const status = this.statusFilter();
    if (status !== 'All') {
      result = result.filter(c => c.status === status);
    }

    // Category filter
    const category = this.categoryFilter();
    if (category !== 'All') {
      result = result.filter(c => c.category === category);
    }

    // Sort result
    const key = this.sortKey();
    const direction = this.sortDirection();
    result.sort((a: any, b: any) => {
      const valA = a[key];
      const valB = b[key];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return direction === 'asc' ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return direction === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });

    return result;
  });

  // Paginated view of courses
  readonly paginatedCourses = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + Number(this.pageSize());
    return this.filteredCourses().slice(start, end);
  });

  readonly totalPages = computed(() => {
    return Math.ceil(this.filteredCourses().length / this.pageSize()) || 1;
  });

  onSort(event: { key: string; direction: 'asc' | 'desc' }): void {
    this.sortKey.set(event.key);
    this.sortDirection.set(event.direction);
    this.currentPage.set(1); // reset to page 1 on sort change
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  // Row operations
  onView(course: Course): void {
    this.router.navigate(['/courses', course.id]);
  }

  onEdit(course: Course): void {
    this.router.navigate(['/courses', course.id, 'edit']);
  }

  onDeletePrompt(course: Course): void {
    this.courseToDelete.set(course);
    this.isDeleteModalOpen.set(true);
  }

  onConfirmDelete(): void {
    const course = this.courseToDelete();
    if (course) {
      this.courseService.deleteCourse(course.id).subscribe({
        next: () => {
          this.toastService.success(`Course "${course.courseName}" deleted successfully.`);
          this.isDeleteModalOpen.set(false);
          this.courseToDelete.set(null);
          this.loadCourses();
        },
        error: (err) => {
          this.toastService.error(`Failed to delete course: ${err.message}`);
          this.isDeleteModalOpen.set(false);
          this.courseToDelete.set(null);
        }
      });
    }
  }

  onCancelDelete(): void {
    this.isDeleteModalOpen.set(false);
    this.courseToDelete.set(null);
  }
}
