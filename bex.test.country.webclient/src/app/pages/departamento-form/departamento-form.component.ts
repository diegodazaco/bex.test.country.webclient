import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartamentoService } from '../../services/departamento.service';
import { departamento } from '../../models/departamento.model';
import { PaisService } from '../../services/pais.service';
import { Pais } from '../../models/pais.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-departamento-form',
  standalone: true,
  templateUrl: './departamento-form.component.html',
  styleUrls: ['./departamento-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class DepartamentoFormComponent implements OnInit {
  departamentoForm: FormGroup;
  departamentoId: number | null = null;
  paises: Pais[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private departamentoService: DepartamentoService,
    private paisService: PaisService
  ) {
    this.departamentoForm = this.fb.group({
      nombreDepartamento: ['', Validators.required],
      paisId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.paisService.getAll().subscribe(paises => (this.paises = paises));

    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.departamentoId = +id;
        this.loadDepartamento();
      }
    });
  }

  loadDepartamento(): void {
    if (this.departamentoId) {
      this.departamentoService.getById(this.departamentoId).subscribe(dep => {
        this.departamentoForm.setValue({
          nombreDepartamento: dep.nombreDepartamento,
          paisId: dep.paisId,
        });
      });
    }
  }

  onSubmit(): void {
    if (this.departamentoForm.invalid){
      this.departamentoForm.markAllAsTouched();
      return;
    }

    const data: departamento = this.departamentoForm.value;

    this.departamentoService.getByName(data.nombreDepartamento).subscribe(existe => {
      if (!this.departamentoId && existe) {
        alert('Ya existe un departamento con ese nombre.');
        return;
      }
  
      if (this.departamentoId) {
        this.departamentoService.getById(this.departamentoId).subscribe(actual => {
          if (actual.nombreDepartamento !== data.nombreDepartamento && existe) {
            alert('Ya existe otro departamento con ese nombre');
            return;
          }
          this.guardar(data);
        });
      } else {
        this.guardar(data);
      }
    });
  }

  guardar(departamento: departamento) {
    if (this.departamentoId) {
      departamento.departamentoId = this.departamentoId;
      this.departamentoService.update(departamento).subscribe(() => {
        this.router.navigate(['/departamentos']);
      });
    } else {
      this.departamentoService.create(departamento).subscribe(() => {
        this.router.navigate(['/departamentos']);
      });
    }
  }
}
