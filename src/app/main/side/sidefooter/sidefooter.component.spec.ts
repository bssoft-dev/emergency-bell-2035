import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidefooterComponent } from './sidefooter.component';

describe('SidefooterComponent', () => {
  let component: SidefooterComponent;
  let fixture: ComponentFixture<SidefooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SidefooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SidefooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
