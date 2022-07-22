import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllstatusComponent } from './allstatus.component';

describe('AllstatusComponent', () => {
  let component: AllstatusComponent;
  let fixture: ComponentFixture<AllstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllstatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
