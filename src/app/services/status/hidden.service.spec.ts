import { TestBed } from '@angular/core/testing';

import { HiddenService } from './hidden.service';

describe('HiddenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HiddenService = TestBed.get(HiddenService);
    expect(service).toBeTruthy();
  });
});
