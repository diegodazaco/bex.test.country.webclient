import { Component, OnInit } from '@angular/core';
import { departamento } from '../../models/departamento.model';
import { DepartamentoService } from '../../services/departamento.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-departamentos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './departamentos.component.html',
  styleUrl: './departamentos.component.css'
})
export class DepartamentosComponent implements OnInit {
  departamentos: departamento[] = [];
  departamentoForm: FormGroup;
  mensaje: string = '';
  loading = true;

  constructor(private departamentoService: DepartamentoService, private fb: FormBuilder, private router: Router) {
    this.departamentoForm = this.fb.group({
      nombreDepartamento: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarDepartamentos();
  }

  cargarDepartamentos() {
    this.departamentoService.getAll().subscribe({
      next: (data) => {
        this.departamentos = data;
        this.loading = false;
      },
      error: (err) => { 
        console.error('Error cargando departamentos', err);
        this.loading = false;
      }
    });
  }
  
  navegarACrear() {
    this.router.navigate(['/departamento/form'], { queryParams: { accion: 'crear' } });
  }

  navegarAEditar(id: number) {
    this.router.navigate(['/departamento/form'], { queryParams: { accion: 'editar', id } });
  }

  onDelete(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este departamento?')) {
      this.departamentoService.delete(id).subscribe(() => {
        this.cargarDepartamentos();
      });
    }
  }
}
