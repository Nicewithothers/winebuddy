import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VineyardDashboardComponent } from './vineyard-dashboard.component';

describe('VineyardDashboardComponent', () => {
  let component: VineyardDashboardComponent;
  let fixture: ComponentFixture<VineyardDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VineyardDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VineyardDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
