import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlldetectionComponent } from './alldetection.component';

describe('AlldetectionComponent', () => {
  let component: AlldetectionComponent;
  let fixture: ComponentFixture<AlldetectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlldetectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlldetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
