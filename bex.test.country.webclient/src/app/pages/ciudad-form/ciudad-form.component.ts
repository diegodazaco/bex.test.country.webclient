import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CiudadService } from '../../services/ciudad.service';
import { Ciudad } from '../../models/ciudad.model';
import { DepartamentoService } from '../../services/departamento.service';
import { departamento } from '../../models/departamento.model';
import { PaisService } from '../../services/pais.service';
import { Pais } from '../../models/pais.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ciudad-form',
  standalone: true,
  templateUrl: './ciudad-form.component.html',
  styleUrls: ['./ciudad-form.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class CiudadFormComponent implements OnInit {
  ciudadForm: FormGroup;
  ciudadId: number | null = null;
  departamentos: departamento[] = [];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ciudadService: CiudadService,
    private departamentoService: DepartamentoService
  ) {
    this.ciudadForm = this.fb.group({ 
      nombreCiudad: ['', Validators.required],
      departamentoId: [null, Validators.required],
      nombrePais: ['']
    });
  }

  ngOnInit(): void {
    this.departamentoService.getAll().subscribe(departamentos => (this.departamentos = departamentos));

    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.ciudadId = +id;
        this.loadDepartamento();
      }
    });
  }

  loadDepartamento(): void {
    if (this.ciudadId) {
      this.ciudadService.getById(this.ciudadId).subscribe(ciu => {
        this.ciudadForm.setValue({
          nombreCiudad: ciu.nombreCiudad,
          departamentoId: ciu.departamentoId,
          nombrePais: ciu.nombrePais
        });
      });
    }
  }

  onSubmit(): void {
    if (this.ciudadForm.invalid){
      this.ciudadForm.markAllAsTouched();
      return;
    }

    const data: Ciudad = this.ciudadForm.value;

    this.ciudadService.getByName(data.nombreCiudad).subscribe(existe => {
      if (!this.ciudadId && existe) {
        alert('Ya existe una ciudad con ese nombre.');
        return;
      }
  
      if (this.ciudadId) {
        this.ciudadService.getById(this.ciudadId).subscribe(actual => {
          if (actual.nombreCiudad !== data.nombreCiudad && existe) {
            alert('Ya existe otra ciudad con ese nombre');
            return;
          }
          this.guardar(data);
        });
      } else {
        this.guardar(data);
      }
    });
  }
  
  guardar(ciudad : Ciudad){
    if (this.ciudadId) {
      ciudad.ciudadId = this.ciudadId;
      this.ciudadService.update(ciudad).subscribe(() => {
        this.router.navigate(['/ciudades']);
      });
    } else {
      this.ciudadService.create(ciudad).subscribe(() => {
        this.router.navigate(['/ciudades']);
      });
    }
  }
}