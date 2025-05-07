import { Component, OnInit } from '@angular/core';
import { Pais } from '../../models/pais.model';
import { PaisService } from '../../services/pais.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-paises',
  standalone: true,
  templateUrl: './paises.component.html',
  styleUrls: ['./paises.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class PaisesComponent implements OnInit {
  paises: Pais[] = [];
  paisForm: FormGroup;
  mensaje: string = '';
  loading = true;

  constructor(private paisService: PaisService, private fb: FormBuilder, private router: Router) {
    this.paisForm = this.fb.group({
      nombrePais: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarPaises();
  }

  cargarPaises() {
    this.paisService.getAll().subscribe({
      next: (data) => {
        this.paises = data;
        this.loading = false;
      },
      error: (err) => { 
        console.error('Error cargando países', err);
        this.loading = false;
      }
    });
  }
  
  navegarACrear() {
    this.router.navigate(['/pais/form'], { queryParams: { accion: 'crear' } });
  }

  navegarAEditar(id: number) {
    this.router.navigate(['/pais/form'], { queryParams: { accion: 'editar', id } });
  }

  onDelete(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este país?')) {
      this.paisService.delete(id).subscribe(() => {
        this.cargarPaises();
      });
    }
  }
  crearPais() {
    if (this.paisForm.invalid) return;

    const nuevoPais: Pais = {
      paisId: 0,
      nombrePais: this.paisForm.value.nombrePais
    };

    this.paisService.create(nuevoPais).subscribe({
      next: pais => {
        this.paises.push(pais);
        this.paisForm.reset();
        this.mensaje = 'País creado con éxito';
      },
      error: err => {
        console.error('Error al crear país', err);
        this.mensaje = 'Hubo un error al crear el país';
      }
    });
  }
}
