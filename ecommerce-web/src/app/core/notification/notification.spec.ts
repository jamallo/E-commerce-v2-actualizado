import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationService } from './service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({})
    .compileComponents();
    service = TestBed.inject(NotificationService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });
});
