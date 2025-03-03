import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';

describe('LoaderService', () => {
  let service: LoaderService;
  let mockOverlay: jasmine.SpyObj<Overlay>;
  let mockOverlayRef: jasmine.SpyObj<OverlayRef>;

  beforeEach(() => {
    mockOverlayRef = jasmine.createSpyObj('OverlayRef', ['attach', 'dispose']);
    mockOverlay = jasmine.createSpyObj('Overlay', ['create']);

    mockOverlay.create.and.returnValue(mockOverlayRef);

    TestBed.configureTestingModule({
      providers: [LoaderService, { provide: Overlay, useValue: mockOverlay }],
    });

    service = TestBed.inject(LoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create() and attach() overlay when show() is called', () => {
    service.show();

    expect(mockOverlay.create).toHaveBeenCalledWith({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
    });

    expect(mockOverlayRef.attach).toHaveBeenCalled();
  });

  it('should dispose() overlay when hide() is called', () => {
    service.show();
    service.hide();

    expect(mockOverlayRef.dispose).toHaveBeenCalled();

    expect((service as any).overlayRef).toBeNull();
  });
});
