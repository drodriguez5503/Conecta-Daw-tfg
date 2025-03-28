import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConectionsComponent } from './conections.component';

describe('ConectionsComponent', () => {
  let component: ConectionsComponent;
  let fixture: ComponentFixture<ConectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
