import { Injectable, inject } from '@angular/core';
import { Database } from '@angular/fire/database';
import { ref, set, get, update, remove, child, DataSnapshot } from 'firebase/database';

@Injectable({
    providedIn: 'root'
})
export class RealtimeDbService {
    private db: Database = inject(Database);

    /**
     * Cria ou sobrescreve dados em um caminho específico
     * @param path O caminho onde os dados serão salvos
     * @param data Os dados a serem salvos
     */
    async create(path: string, data: any): Promise<void> {
        const dbRef = ref(this.db, path);
        return set(dbRef, data);
    }

    /**
     * Lê dados de um caminho específico
     * @param path O caminho de onde os dados serão lidos
     * @returns Os dados do caminho ou null caso não exista
     */
    async read(path: string): Promise<any> {
        const dbRef = ref(this.db);
        const snapshot: DataSnapshot = await get(child(dbRef, path));
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            return null;
        }
    }

    /**
     * Atualiza campos específicos de dados em um caminho sem sobrescrever tudo
     * @param path O caminho a ser atualizado
     * @param data Os novos campos de dados para atualização
     */
    async update(path: string, data: any): Promise<void> {
        const dbRef = ref(this.db, path);
        return update(dbRef, data);
    }

    /**
     * Exclui dados em um caminho específico
     * @param path O caminho a ser excluído
     */
    async delete(path: string): Promise<void> {
        const dbRef = ref(this.db, path);
        return remove(dbRef);
    }
}
