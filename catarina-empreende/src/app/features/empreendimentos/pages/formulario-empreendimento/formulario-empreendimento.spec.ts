import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioEmpreendimento } from './formulario-empreendimento';

describe('FormularioEmpreendimento', () => {
  let component: FormularioEmpreendimento;
  let fixture: ComponentFixture<FormularioEmpreendimento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioEmpreendimento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioEmpreendimento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
