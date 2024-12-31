import { TestBed } from '@angular/core/testing';

import { DevicePermissionsService } from './device-permissions.service';

describe('DevicePermissionsService', () => {
  let service: DevicePermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DevicePermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
