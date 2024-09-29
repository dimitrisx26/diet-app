import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesViewComponent } from './leaves-view.component';

describe('LeavesViewComponent', () => {
  let component: LeavesViewComponent;
  let fixture: ComponentFixture<LeavesViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavesViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeavesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
