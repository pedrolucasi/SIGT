import { TestBed } from '@angular/core/testing';

import { TccService } from './tcc-service';

describe('TccService', () => {
  let service: TccService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TccService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
