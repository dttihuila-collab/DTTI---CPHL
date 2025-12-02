import React from 'react';

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 rounded-md my-4 font-mono text-sm overflow-x-auto border dark:border-gray-700">
        <code>{children}</code>
    </div>
);

const DatabaseSetup: React.FC = React.memo(() => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg">
                <div className="p-6 border-b dark:border-gray-700">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Configuração do Banco de Dados</h2>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Guia para migrar da base de dados local para uma base de dados real com Neon.
                    </p>
                </div>
                <div className="p-6 space-y-6">
                    <p className="text-gray-700 dark:text-gray-300">
                        Atualmente, a aplicação utiliza dados de demonstração armazenados localmente no seu navegador. Para usar a aplicação em produção com uma base de dados persistente e escalável, recomendamos a utilização do Neon, um PostgreSQL serverless.
                    </p>

                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 pt-2">Passo 1: Iniciar o projeto Neon</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                        Execute o seguinte comando no seu terminal para iniciar um novo projeto Neon. Isto irá guiá-lo na criação ou ligação a uma base de dados PostgreSQL.
                    </p>
                    <CodeBlock>
                        npx neonctl@latest init
                    </CodeBlock>

                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Passo 2: Criar um Serviço de Backend</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                        Precisará de um serviço de backend (por exemplo, usando Node.js com Express, ou Funções Serverless) que se conecte à sua nova base de dados Neon. Este backend irá expor uma API para a aplicação frontend consumir.
                    </p>
                    
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Passo 3: Atualizar a Configuração da API</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                        Finalmente, o ficheiro <code className="text-sm bg-gray-200 dark:bg-gray-700 dark:text-gray-300 p-1 rounded">services/api.ts</code> na aplicação frontend precisará de ser modificado. Em vez de ler dados locais, ele deverá fazer chamadas <code className="text-sm bg-gray-200 dark:bg-gray-700 dark:text-gray-300 p-1 rounded">fetch</code> para os endpoints da sua nova API de backend.
                    </p>
                    
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/50 border-l-4 border-blue-400 dark:border-blue-500 text-blue-800 dark:text-blue-300 rounded-r-lg">
                        <p className="font-bold">Nota:</p>
                        <p>A integração de um backend é uma alteração de arquitetura significativa. Este guia fornece os passos iniciais, mas a implementação completa do backend está fora do escopo das modificações que podem ser feitas diretamente nesta interface.</p>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default DatabaseSetup;