import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniCestaComponent } from './mini-cesta.component';

describe('MiniCestaComponent', () => {
  let component: MiniCestaComponent;
  let fixture: ComponentFixture<MiniCestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniCestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniCestaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
