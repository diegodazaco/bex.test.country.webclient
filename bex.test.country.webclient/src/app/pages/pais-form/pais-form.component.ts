import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaisService } from '../../services/pais.service';
import { Pais } from '../../models/pais.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pais-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pais-form.component.html',
  styleUrls: ['./pais-form.component.css'],
})
export class PaisFormComponent implements OnInit {
  paisForm: FormGroup;
  paisId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private paisService: PaisService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.paisForm = this.formBuilder.group({
      nombrePais: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.paisId = +id;
        this.loadPais();
      }
    });
  }

  loadPais(): void {
    if (this.paisId) {
      this.paisService.getById(this.paisId).subscribe((pais) => {
        this.paisForm.setValue({
          nombrePais: pais.nombrePais,
        });
      });
    }
  }

  onSubmit(): void {
    if (this.paisForm.invalid){
      this.paisForm.markAllAsTouched();
      return;
    }

    const pais: Pais = this.paisForm.value;

    this.paisService.getByName(pais.nombrePais).subscribe(existe => {
      if (!this.paisId && existe) {
        alert('Ya existe un país con ese nombre.');
        return;
      }
  
      if (this.paisId) {
        this.paisService.getById(this.paisId).subscribe(actual => {
          if (actual.nombrePais !== pais.nombrePais && existe) {
            alert('Ya existe otro país con ese nombre');
            return;
          }
          this.guardar(pais);
        });
      } else {
        this.guardar(pais);
      }
    });
  }

  guardar(pais: Pais) {
    if (this.paisId) {
      pais.paisId = this.paisId;
      this.paisService.update(pais).subscribe(() => {
        this.router.navigate(['/paises']);
      });
    } else {
      this.paisService.create(pais).subscribe(() => {
        this.router.navigate(['/paises']);
      });
    }
  }
}
