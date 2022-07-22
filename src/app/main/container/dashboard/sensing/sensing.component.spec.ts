import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SensingComponent } from './sensing.component';

describe('SensingComponent', () => {
  let component: SensingComponent;
  let fixture: ComponentFixture<SensingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SensingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SensingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
