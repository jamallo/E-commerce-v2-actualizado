import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CestaComponent } from './cesta';

describe('CestaComponent', () => {
  let component: CestaComponent;
  let fixture: ComponentFixture<CestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CestaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
