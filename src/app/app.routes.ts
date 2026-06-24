import { Routes } from '@angular/router';
import { unsavedChangesGuard } from './core/guards/unsaved-changes.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'courses',
    pathMatch: 'full'
  },
  {
    path: 'courses',
    loadComponent: () => import('./features/courses/pages/course-list/course-list.component').then(m => m.CourseListComponent)
  },
  {
    path: 'courses/new',
    loadComponent: () => import('./features/courses/pages/course-form/course-form.component').then(m => m.CourseFormComponent),
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: 'courses/:id',
    loadComponent: () => import('./features/courses/pages/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
  },
  {
    path: 'courses/:id/edit',
    loadComponent: () => import('./features/courses/pages/course-form/course-form.component').then(m => m.CourseFormComponent),
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: '**',
    redirectTo: 'courses'
  }
];
