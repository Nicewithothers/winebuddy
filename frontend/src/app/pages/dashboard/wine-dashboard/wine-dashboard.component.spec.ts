import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WineDashboardComponent } from './wine-dashboard.component';

describe('WineDashboardComponent', () => {
  let component: WineDashboardComponent;
  let fixture: ComponentFixture<WineDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WineDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WineDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
