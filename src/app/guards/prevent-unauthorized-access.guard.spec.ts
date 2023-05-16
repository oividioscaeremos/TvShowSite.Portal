import { TestBed } from '@angular/core/testing';

import { PreventUnauthorizedAccessGuard } from './prevent-unauthorized-access.guard';

describe('PreventUnauthorizedAccessGuardGuard', () => {
  let guard: PreventUnauthorizedAccessGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventUnauthorizedAccessGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
