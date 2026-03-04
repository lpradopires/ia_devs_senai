import { Injectable, inject } from '@angular/core';
import { RealtimeDbService } from '../../../core/firebase/realtime-db.service';
import { Empreendimento } from '../model/empreendimento.model';

@Injectable({
    providedIn: 'root'
})
export class EmpreendimentoService {
    private dbService = inject(RealtimeDbService);
    private readonly PATH = 'empreendimentos';

    /**
     * Cria um novo empreendimento no banco de dados.
     * Se o ID não for fornecido, um UUID será gerado automaticamente.
     * @param empreendimento Os dados do empreendimento a ser criado
     * @returns Uma Promise com o ID do empreendimento criado
     */
    async criar(empreendimento: Empreendimento): Promise<string> {
        const id = empreendimento.id || crypto.randomUUID();
        const novoEmpreendimento = { ...empreendimento, id };

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
