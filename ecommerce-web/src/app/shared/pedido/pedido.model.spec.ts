import { TestBed } from '@angular/core/testing';

import { PedidoService } from './pedido.model';

describe('PedidoModel', () => {
  let service: PedidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
