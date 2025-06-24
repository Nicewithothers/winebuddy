import { TestBed } from '@angular/core/testing';

import { CellarService } from './cellar.service';

describe('CellarService', () => {
  let service: CellarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CellarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
