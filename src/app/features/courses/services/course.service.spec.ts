import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { CourseService } from './course.service';
import { Course } from '../models/course.model';

describe('CourseService', () => {
  let service: CourseService;
  let httpTestingController: HttpTestingController;

  const mockCourses: Course[] = [
    {
      id: '1',
      courseName: 'Test Angular',
      instructorName: 'John',
      category: 'Frontend',
      duration: 10,
      price: 100,
      status: 'Active',
      createdDate: '2026-06-01'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CourseService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(CourseService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all courses', () => {
    service.getCourses().subscribe(courses => {
      expect(courses.length).toBe(1);
      expect(courses[0].courseName).toBe('Test Angular');
    });

    const req = httpTestingController.expectOne('http://localhost:3000/courses');
    expect(req.request.method).toBe('GET');
    req.flush(mockCourses);
  });

  it('should create a course with current date', () => {
    const newCourseData = {
      courseName: 'TypeScript Basics',
      instructorName: 'Sarah',
      category: 'Frontend',
      duration: 8,
      price: 50,
      status: 'Draft' as const
    };

    service.createCourse(newCourseData).subscribe(course => {
      expect(course.id).toBe('2');
      expect(course.createdDate).toBeDefined();
    });

    const req = httpTestingController.expectOne('http://localhost:3000/courses');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.createdDate).toBeDefined();
    req.flush({ ...newCourseData, id: '2', createdDate: '2026-06-24' });
  });
});
