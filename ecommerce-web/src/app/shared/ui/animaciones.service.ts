import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AnimacionesService {

  volarACesta(origen: HTMLElement, destino: HTMLElement): void {
    const origenRect = origen.getBoundingClientRect();
    const destinoRect = origen.getBoundingClientRect();

    const clon = origen.cloneNode(true) as HTMLElement;

    clon.style.position = 'fixed';
    clon.style.top = `${origenRect.top}px`;
    clon.style.left = `${origenRect.left}px`;
    clon.style.width = `${origenRect.width}px`;
    clon.style.height = `${origenRect.height}px`;
    clon.style.transition = 'all 0.6s ease-in-out';
    clon.style.zIndex = '2000';
    clon.style.pointerEvents = 'none';

    document.body.appendChild(clon);

    requestAnimationFrame(() => {
      clon.style.top = `${destinoRect.top}px`;
      clon.style.left = `${destinoRect.left}px`;
      clon.style.width = '24px';
      clon.style.height = '24px';
      clon.style.opacity = '0';
      clon.style.transform = 'scale(0.3)';
    });

    setTimeout(() => {
      clon.remove();
    }, 650);
  }

}
