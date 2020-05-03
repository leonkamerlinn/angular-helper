import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularHelperComponent } from './angular-helper.component';

describe('AngularHelperComponent', () => {
  let component: AngularHelperComponent;
  let fixture: ComponentFixture<AngularHelperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
