import { TestBed } from '@angular/core/testing';

import { ScannerService } from './barcode-scanner.service';

describe('BarcodeScannerService', () => {
  let service: ScannerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScannerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
