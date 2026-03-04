import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEmpreendimento } from './lista-empreendimento';

describe('ListaEmpreendimento', () => {
  let component: ListaEmpreendimento;
  let fixture: ComponentFixture<ListaEmpreendimento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaEmpreendimento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaEmpreendimento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
