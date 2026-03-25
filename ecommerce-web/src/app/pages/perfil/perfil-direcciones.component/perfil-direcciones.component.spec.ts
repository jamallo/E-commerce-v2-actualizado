import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilDireccionesComponent } from './perfil-direcciones.component';

describe('PerfilDireccionesComponent', () => {
  let component: PerfilDireccionesComponent;
  let fixture: ComponentFixture<PerfilDireccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilDireccionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilDireccionesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
