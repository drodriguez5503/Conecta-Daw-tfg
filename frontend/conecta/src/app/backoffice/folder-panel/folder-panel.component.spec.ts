import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderPanelComponent } from './folder-panel.component';

describe('FolderPanelComponent', () => {
  let component: FolderPanelComponent;
  let fixture: ComponentFixture<FolderPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolderPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolderPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
