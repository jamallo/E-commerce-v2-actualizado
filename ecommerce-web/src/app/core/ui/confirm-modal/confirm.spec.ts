import { TestBed } from '@angular/core/testing';

import { ConfirmService } from './confirm';

describe('Confirm', () => {
  let service: ConfirmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
