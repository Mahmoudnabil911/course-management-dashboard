import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { ToastService } from '../../../../core/services/toast.service';
import { SkeletonLoaderComponent } from '../../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonLoaderComponent],
  templateUrl: './course-detail.component.html'
})
export class CourseDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly toastService = inject(ToastService);

  readonly course = signal<Course | null>(null);
  readonly isLoading = signal(true);
  readonly errorState = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCourse(id);
    } else {
      this.errorState.set('Invalid course ID');
      this.isLoading.set(false);
    }
  }

  loadCourse(id: string): void {
    this.isLoading.set(true);
    this.errorState.set(null);
    this.courseService.getCourseById(id).subscribe({
      next: (data) => {
        this.course.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorState.set(err.message || 'Failed to load course details.');
        this.isLoading.set(false);
        this.toastService.error('Failed to load course details.');
      }
    });
  }

  onEdit(): void {
    const currentCourse = this.course();
    if (currentCourse) {
      this.router.navigate(['/courses', currentCourse.id, 'edit']);
    }
  }
}
