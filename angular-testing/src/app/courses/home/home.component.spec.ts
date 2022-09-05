import {waitForAsync, ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed} from '@angular/core/testing';
import {CoursesModule} from '../courses.module';
import {DebugElement} from '@angular/core';

import {HomeComponent} from './home.component';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {CoursesService} from '../services/courses.service';
import {HttpClient} from '@angular/common/http';
import {COURSES} from '../../../../server/db-data';
import {setupCourses} from '../common/setup-test-data';
import {By} from '@angular/platform-browser';
import {of} from 'rxjs';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {click} from '../common/test-utils';


describe('HomeComponent', () => {

  let fixture: ComponentFixture<HomeComponent>;
  let component:HomeComponent;
  let el: DebugElement;
  let coursesService: any;
  const beginCourses = setupCourses().filter(course => course.category == 'BEGINNER');
  const advancedCourses = setupCourses().filter(course => course.category == 'ADVANCED');
  const allCourses = setupCourses();

  beforeEach(waitForAsync(() => {

      let coursesServiceSpy = jasmine.createSpyObj('CoursesService', ["findAllCourses"]);

      TestBed.configureTestingModule({
          imports: [
            CoursesModule, //import module for have all dependency
            NoopAnimationsModule // (!) important, desactive animation
          ],
          providers:[
            {provide: CoursesService, useValue:coursesServiceSpy}
          ]
      })
      .compileComponents() // Async process
      .then(() => {
          fixture = TestBed.createComponent(HomeComponent);
          component = fixture.componentInstance;
          el = fixture.debugElement;
          coursesService = TestBed.get(CoursesService);
      });
  }));

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });


  it("should display only beginner courses", () => {
    coursesService.findAllCourses.and.returnValue(of(beginCourses)); // Sync
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });


  it("should display only advanced courses", () => {
    coursesService.findAllCourses.and.returnValue(of(advancedCourses)); // Sync
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
  });


  it("should display both tabs", () => {
    coursesService.findAllCourses.and.returnValue(of(allCourses)); // Sync
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    expect(tabs.length).toBe(2, "Unexpected number of tabs found");
  });


  it("should display advanced courses when tab clicked - FakeAsync", fakeAsync(() => {
    coursesService.findAllCourses.and.returnValue(of(allCourses));
    fixture.detectChanges();
    const tabs = el.queryAll(By.css(".mat-tab-label"));
    click(tabs[1]); // test helper on common folder
    fixture.detectChanges();
    flush();

    const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title')); // Get all card of tabs active
    expect(cardTitles.length).toBeGreaterThan(0,"Could not find card titles"); // Check if we have card one tab active
    expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course"); // check title of component

    // test if the name of the tab is "advanced"
    console.log(tabs[1].nativeElement.textContent);
    expect(tabs[1].nativeElement.textContent).toContain("Advanced test name");

  }));

  it("should display advanced courses when tab clicked - Async", waitForAsync(() => {
      // accept HTTP request
      coursesService.findAllCourses.and.returnValue(of(allCourses));
      fixture.detectChanges();
      const tabs = el.queryAll(By.css(".mat-tab-label"));
      click(tabs[1]); // test helper on common folder
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const cardTitles = el.queryAll(By.css('.mat-tab-body-active .mat-card-title')); // Get all card of tabs active
        expect(cardTitles.length).toBeGreaterThan(0,"Could not find card titles"); // Check if we have card one tab active
        expect(cardTitles[0].nativeElement.textContent).toContain("Angular Security Course"); // check title of component

        // test if the name of the tab is "advanced"
        console.log(tabs[1].nativeElement.textContent);
        expect(tabs[1].nativeElement.textContent).toContain("Advanced test name");

      });
    }));
});
