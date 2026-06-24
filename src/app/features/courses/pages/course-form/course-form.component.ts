import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { ToastService } from '../../../../core/services/toast.service';
import { HasUnsavedChanges } from '../../../../core/guards/unsaved-changes.guard';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './course-form.component.html'
})
export class CourseFormComponent implements OnInit, HasUnsavedChanges {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);
  private readonly toastService = inject(ToastService);

  readonly isEditMode = signal(false);
  readonly courseId = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly isSubmitted = signal(false);

  courseForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    
    // Check if editing existing course
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.courseId.set(id);
      this.loadCourse(id);
    }
  }

  private initForm(): void {
    this.courseForm = this.fb.group({
      courseName: ['', [Validators.required, Validators.minLength(3)]],
      instructorName: ['', [Validators.required]],
      category: ['', [Validators.required]],
      duration: [null, [Validators.required, Validators.min(0.001)]],
      price: [null, [Validators.required, Validators.min(0)]],
      status: ['Draft', [Validators.required]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  private loadCourse(id: string): void {
    this.isLoading.set(true);
    this.courseService.getCourseById(id).subscribe({
      next: (course) => {
        this.courseForm.patchValue(course);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.toastService.error(`Failed to load course: ${err.message}`);
        this.isLoading.set(false);
        this.router.navigate(['/courses']);
      }
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      this.courseForm.markAllAsTouched();
      this.toastService.warning('Please correct all validation errors.');
      return;
    }

    const formValue = this.courseForm.value;
    const payload = {
      ...formValue,
      duration: Number(formValue.duration),
      price: Number(formValue.price)
    };

    this.isSubmitted.set(true);
    this.isLoading.set(true);

    if (this.isEditMode()) {
      this.courseService.updateCourse(this.courseId()!, payload).subscribe({
        next: () => {
          this.toastService.success(`Course "${payload.courseName}" updated successfully.`);
          this.isLoading.set(false);
          // Navigate with replaceUrl: true to ensure form cannot be returned to via browser back button
          this.router.navigate(['/courses'], { replaceUrl: true });
        },
        error: (err) => {
          this.toastService.error(`Failed to update course: ${err.message}`);
          this.isLoading.set(false);
          this.isSubmitted.set(false);
        }
      });
    } else {
      this.courseService.createCourse(payload).subscribe({
        next: () => {
          this.toastService.success(`Course "${payload.courseName}" created successfully.`);
          this.isLoading.set(false);
          // Navigate with replaceUrl: true to ensure form cannot be returned to via browser back button
          this.router.navigate(['/courses'], { replaceUrl: true });
        },
        error: (err) => {
          this.toastService.error(`Failed to create course: ${err.message}`);
          this.isLoading.set(false);
          this.isSubmitted.set(false);
        }
      });
    }
  }

  // Check for unsaved changes (Router Guard)
  hasUnsavedChanges(): boolean {
    return this.courseForm.dirty && !this.isSubmitted();
  }

  // Form Field validation helpers
  isFieldInvalid(fieldName: string): boolean {
    const field = this.courseForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
