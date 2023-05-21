import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextToWatchPageComponent } from './next-to-watch-page.component';

describe('NextToWatchPageComponent', () => {
  let component: NextToWatchPageComponent;
  let fixture: ComponentFixture<NextToWatchPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NextToWatchPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NextToWatchPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
