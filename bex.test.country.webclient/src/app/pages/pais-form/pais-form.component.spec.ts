import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaisFormComponent } from './pais-form.component';

describe('PaisFormComponent', () => {
  let component: PaisFormComponent;
  let fixture: ComponentFixture<PaisFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaisFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaisFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
