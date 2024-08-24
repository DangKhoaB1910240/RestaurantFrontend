import { TestBed } from '@angular/core/testing';

import { TinhThanhService } from './tinh-thanh.service';

describe('TinhThanhService', () => {
  let service: TinhThanhService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TinhThanhService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
