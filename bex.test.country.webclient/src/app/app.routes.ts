import { Routes } from '@angular/router';
import { PaisesComponent } from './pages/paises/paises.component';
import { PaisFormComponent } from './pages/pais-form/pais-form.component';
import { DepartamentosComponent } from './pages/departamentos/departamentos.component';
import { DepartamentoFormComponent } from './pages/departamento-form/departamento-form.component';
import { CiudadesComponent } from './pages/ciudades/ciudades.component';
import { CiudadFormComponent } from './pages/ciudad-form/ciudad-form.component';

export const routes: Routes = [
    {
        path: 'paises',
        loadComponent: () => import('./pages/paises/paises.component').then(m => m.PaisesComponent),
    },
    {
        path: 'departamentos',
        loadComponent: () => import('./pages/departamentos/departamentos.component').then(m => m.DepartamentosComponent),
    },
    {
        path: 'ciudades',
        loadComponent: () => import('./pages/ciudades/ciudades.component').then(m => m.CiudadesComponent),
    },
    { path: '', redirectTo: 'paises', pathMatch: 'full' },
    { path: 'paises', component: PaisesComponent },
    { path: 'pais/form', component: PaisFormComponent },
    { path: 'pais/form/:id', component: PaisFormComponent },
    { path: 'departamento/form', component: DepartamentoFormComponent },
    { path: 'departamento/form/:id', component: DepartamentoFormComponent },
    { path: 'ciudad/form', component: CiudadFormComponent },
    { path: 'ciudad/form/:id', component: CiudadFormComponent },
];
