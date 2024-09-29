import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttedanceViewComponent } from './attedance-view.component';

describe('AttedanceViewComponent', () => {
  let component: AttedanceViewComponent;
  let fixture: ComponentFixture<AttedanceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttedanceViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AttedanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
