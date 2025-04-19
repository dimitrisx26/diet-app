import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietPlanEditorComponent } from './diet-plan-editor.component';

describe('DietPlanEditorComponent', () => {
  let component: DietPlanEditorComponent;
  let fixture: ComponentFixture<DietPlanEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietPlanEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DietPlanEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
