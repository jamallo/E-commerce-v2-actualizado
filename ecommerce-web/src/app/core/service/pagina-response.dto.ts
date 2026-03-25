

export interface PaginaResponseDTO<T> {
  contenido: T[];
  paginaActual: number;
  tamanioPaginas: number;
  totalElementos: number;
  totalPaginas: number;
}
