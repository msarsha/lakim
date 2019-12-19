import { TestBed } from '@angular/core/testing';

import { EventSourceService } from './event-source.service';

describe('EventSourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EventSourceService = TestBed.get(EventSourceService);
    expect(service).toBeTruthy();
  });
});
