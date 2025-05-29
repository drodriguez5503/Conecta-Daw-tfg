import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectOptionsSidebarComponent } from './project-options-sidebar.component';

describe('ProjectOptionsSidebarComponent', () => {
  let component: ProjectOptionsSidebarComponent;
  let fixture: ComponentFixture<ProjectOptionsSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectOptionsSidebarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectOptionsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
