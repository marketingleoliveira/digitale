# Plano de Implementação: Novo Layout de Tecnologias

O objetivo é reformular a página de Tecnologias para seguir fielmente a referência visual enviada pelo usuário, adotando um layout de cards horizontais com logos circulares e adicionando as tecnologias faltantes.

## Etapas

1.  **Dados e Backend:**
    *   Executar migração para adicionar as tecnologias faltantes: `SUPER BLACK`, `CREORA HIGHCLO`, `ALOE VERA`, `DIGITALE ECO`.
    *   Atualizar nomes e descrições das tecnologias existentes para alinhar com a referência.

2.  **Interface Frontend (`src/pages/Technologies.tsx`):**
    *   Redesenhar o grid de tecnologias para usar um layout de 2 colunas no desktop (conforme a imagem).
    *   Implementar cards horizontais:
        *   Logo circular à esquerda.
        *   Conteúdo à direita: Título (Navy) + Subtítulo (Orange).
        *   Descrição abaixo do cabeçalho do card.
    *   Ajustar tipografia e cores conforme os tokens semânticos e a referência visual.
    *   Remover a seção de benefícios rápida no card para manter a limpeza visual da referência (deixar para o modal).

3.  **Componentes Adicionais:**
    *   Criar ou adaptar o componente de ícone para suportar as variações de cores da referência (Proteção em laranja, Antibacteriano em verde, etc.).

4.  **Verificação:**
    *   Validar o layout em mobile e desktop.
    *   Garantir que os novos itens aparecem corretamente.

## Detalhes Técnicos

*   **Cores:** Navy (`#213754`), Orange (`#FF8A00`).
*   **Shadows:** Sombra suave para os cards brancos.
*   **Grid:** `grid-cols-1 lg:grid-cols-2`.
*   **Aspect Ratio:** As logos circulares devem ter tamanho fixo (ex: `w-20 h-20` ou `w-24 h-24`).
