import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailtabComponent } from './emailtab.component';

describe('EmailtabComponent', () => {
  let component: EmailtabComponent;
  let fixture: ComponentFixture<EmailtabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailtabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailtabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
