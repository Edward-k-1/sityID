import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KoshikComponent } from './koshik.component';

describe('KoshikComponent', () => {
  let component: KoshikComponent;
  let fixture: ComponentFixture<KoshikComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KoshikComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KoshikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
