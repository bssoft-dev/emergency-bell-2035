import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhontabComponent } from './phontab.component';

describe('PhontabComponent', () => {
  let component: PhontabComponent;
  let fixture: ComponentFixture<PhontabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhontabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhontabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
