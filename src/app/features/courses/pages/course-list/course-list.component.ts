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
  templateUrl: './course-list.component.html'
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
