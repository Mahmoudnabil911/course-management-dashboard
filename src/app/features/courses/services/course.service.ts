import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, switchMap } from 'rxjs';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/courses';

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  createCourse(course: Omit<Course, 'id' | 'createdDate'>): Observable<Course> {
    const newCourse: Omit<Course, 'id'> = {
      ...course,
      createdDate: new Date().toISOString().split('T')[0]
    };
    return this.http.post<Course>(this.apiUrl, newCourse).pipe(
      catchError(this.handleError)
    );
  }

  updateCourse(id: string, course: Partial<Course>): Observable<Course> {
    return this.getCourseById(id).pipe(
      switchMap(existingCourse => {
        const updatedFullCourse: Course = {
          ...existingCourse,
          ...course
        };
        return this.http.put<Course>(`${this.apiUrl}/${id}`, updatedFullCourse);
      }),
      catchError(this.handleError)
    );
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred.';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `API Error (Status ${error.status}): ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
