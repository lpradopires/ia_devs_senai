import { Injectable, inject } from '@angular/core';
import { Database, ref, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Empreendimento } from '../model/empreendimento.model';
import { RealtimeDbService } from '../../../core/firebase/realtime-db.service';

@Injectable({
    providedIn: 'root'
})
export class EmpreendimentoService {
    private readonly dbService = inject(RealtimeDbService);
    private readonly db = inject(Database);
    private readonly PATH = 'empreendimentos';

    /**
     * Retorna um Observable que emite a lista completa de empreendimentos
     * em tempo real. O Firebase mantém um listener ativo e notifica todos
     * os clientes conectados sempre que qualquer dado for alterado.
     */
    observarTodos(): Observable<Empreendimento[]> {
        return new Observable<Empreendimento[]>(observador => {
            const referencia = ref(this.db, this.PATH);

            const cancelarEscuta = onValue(referencia, (snapshot) => {
                if (snapshot.exists()) {
                    const dados = snapshot.val();
                    observador.next(Object.values<Empreendimento>(dados));
                } else {
                    observador.next([]);
                }
            }, (erro) => {
                observador.error(erro);
            });

            return () => cancelarEscuta();
        }).pipe(
            // Ordena do mais recente para o mais antigo.
            // Registros sem dataCriacao (legados) ficam no final.
            map(lista => lista.sort((a, b) =>
                (b.dataCriacao ?? 0) - (a.dataCriacao ?? 0)
            ))
        );
    }

    /**
     * Cria um novo empreendimento no banco de dados.
     * Se o ID não for fornecido, um UUID será gerado automaticamente.
     * @param empreendimento Os dados do empreendimento a ser criado
     * @returns Uma Promise com o ID do empreendimento criado
     */
    async criar(empreendimento: Empreendimento): Promise<string> {
        const id = empreendimento.id || crypto.randomUUID();
        const novoEmpreendimento: Empreendimento = {
            ...empreendimento,
            id,
            dataCriacao: Date.now()
        };

        await this.dbService.create(`${this.PATH}/${id}`, novoEmpreendimento);
        return id;
    }

    /**
     * Busca um empreendimento específico pelo seu ID.
     * @param id O identificador único do empreendimento
     * @returns Uma Promise com os dados do empreendimento ou null se não encontrado
     */
    async buscarPorId(id: string): Promise<Empreendimento | null> {
        return this.dbService.read(`${this.PATH}/${id}`);
    }

    /**
     * Busca todos os empreendimentos cadastrados.
     * @returns Uma Promise contendo um array de empreendimentos
     */
    async buscarTodos(): Promise<Empreendimento[]> {
        const dados = await this.dbService.read(this.PATH);
        if (!dados) return [];

        // O Firebase Realtime DB retorna um objeto onde as chaves são os IDs,
        // então precisamos converter esse objeto em um array
        return Object.values(dados);
    }

    /**
     * Atualiza os dados de um empreendimento existente.
     * @param id O identificador único do empreendimento a ser atualizado
     * @param atualizacoes Um objeto contendo apenas os campos que devem ser atualizados
     */
    async atualizar(id: string, atualizacoes: Partial<Empreendimento>): Promise<void> {
        return this.dbService.update(`${this.PATH}/${id}`, atualizacoes);
    }

    /**
     * Exclui um empreendimento do banco de dados.
     * @param id O identificador único do empreendimento a ser excluído
     */
    async excluir(id: string): Promise<void> {
        return this.dbService.delete(`${this.PATH}/${id}`);
    }
}
