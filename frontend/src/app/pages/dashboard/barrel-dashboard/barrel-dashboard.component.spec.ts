import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarrelDashboardComponent } from './barrel-dashboard.component';

describe('BarrelDashboardComponent', () => {
  let component: BarrelDashboardComponent;
  let fixture: ComponentFixture<BarrelDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BarrelDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarrelDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
