
-- 1. Identificar e deletar TODOS os registros que tenham a mensagem duplicada "Minha família tem uma malharia desde os anos 90"
-- e qualquer outra mensagem que apareça mais de uma vez, mantendo apenas a mais recente de cada.
DELETE FROM public.radar_topic_suggestions
WHERE id IN (
    SELECT id
    FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY message ORDER BY created_at DESC) as rn
        FROM public.radar_topic_suggestions
        WHERE message IS NOT NULL
    ) t
    WHERE t.rn > 1
);

-- 2. Garantir que o índice de unicidade cubra também o caso de mensagens sozinhas se repetirem, 
-- mesmo que o tópico seja diferente (para evitar a percepção de repetição de conteúdo).
DROP INDEX IF EXISTS radar_topic_suggestions_unique_idx;
CREATE UNIQUE INDEX radar_topic_suggestions_message_unique_idx 
ON public.radar_topic_suggestions (lower(message)) 
WHERE message IS NOT NULL;
