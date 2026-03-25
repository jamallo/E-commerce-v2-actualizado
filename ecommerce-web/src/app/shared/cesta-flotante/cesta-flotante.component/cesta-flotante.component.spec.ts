import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CestaFlotanteComponent } from './cesta-flotante.component';

describe('CestaFlotanteComponent', () => {
  let component: CestaFlotanteComponent;
  let fixture: ComponentFixture<CestaFlotanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CestaFlotanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CestaFlotanteComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
