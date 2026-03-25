import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ConfirmOptions, ConfirmService } from './confirm';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.html',
  styleUrl: './confirm-modal.css',
})
export class ConfirmModalComponent implements OnInit {

  visible = false;
  options!: ConfirmOptions;
  private response$!: any;

  constructor(private confirmService: ConfirmService) {}

  ngOnInit(): void {
    this.confirmService.confirm$.subscribe(({ options, response }) => {
      this.options = options;
      this.response$ = response;
      this.visible = true;
    });
  }

  confirmar(): void {
    this.response$.next(true);
    this.cerrar();
  }

  cancelar(): void {
    this.response$.next(false);
    this.cerrar();
  }

  cerrar(): void {
    this.visible = false;
  }

}
