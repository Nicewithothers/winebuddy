import { TestBed } from '@angular/core/testing';

import { VineyardService } from './vineyard.service';

describe('VineyardService', () => {
  let service: VineyardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VineyardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
