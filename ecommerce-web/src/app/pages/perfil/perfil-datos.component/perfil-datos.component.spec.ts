import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilDatosComponent } from './perfil-datos.component';

describe('PerfilDatosComponent', () => {
  let component: PerfilDatosComponent;
  let fixture: ComponentFixture<PerfilDatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilDatosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PerfilDatosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
