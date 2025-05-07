import { Component, OnInit } from '@angular/core';
import { Ciudad } from '../../models/ciudad.model';
import { CiudadService } from '../../services/ciudad.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ciudades',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './ciudades.component.html',
  styleUrl: './ciudades.component.css'
})
export class CiudadesComponent implements OnInit {
  ciudades: Ciudad[] = [];
  ciudadForm: FormGroup;
  mensaje: string = '';
  loading = true;

  constructor(private ciudadService: CiudadService, private fb: FormBuilder, private router: Router) {
    this.ciudadForm = this.fb.group({
      nombreCiudad: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarCiudades();
  }

  cargarCiudades() {
    this.ciudadService.getAll().subscribe({
      next: (data) => {
        this.ciudades = data;
        this.loading = false;
      },
      error: (err) => { 
        console.error('Error cargando ciudades', err);
        this.loading = false;
      }
    });
  }
  
  navegarACrear() {
    this.router.navigate(['/ciudad/form'], { queryParams: { accion: 'crear' } });
  }

  navegarAEditar(id: number) {
    this.router.navigate(['/ciudad/form'], { queryParams: { accion: 'editar', id } });
  }

  onDelete(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar esta ciudad?')) {
      this.ciudadService.delete(id).subscribe(() => {
        this.cargarCiudades();
      });
    }
  }
}
