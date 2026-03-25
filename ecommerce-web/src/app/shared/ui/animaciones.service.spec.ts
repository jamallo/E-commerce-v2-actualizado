import { TestBed } from '@angular/core/testing';

import { AnimacionesService } from './animaciones.service';

describe('AnimacionesService', () => {
  let service: AnimacionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnimacionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
