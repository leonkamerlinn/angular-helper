import { TestBed } from '@angular/core/testing';

import { AngularHelperService } from './angular-helper.service';

describe('AngularHelperService', () => {
  let service: AngularHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
