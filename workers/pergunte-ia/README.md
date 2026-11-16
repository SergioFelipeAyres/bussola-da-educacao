# Ajuda da IA do "Pergunte à Bússola"

Um Worker da Cloudflare que **só reescreve** a pergunta do leitor em português correto, com as palavras
que a caixa do site conhece. Exemplo: "quantas escola tem conequissao no nordesti" vira
"quantas escolas têm internet no Nordeste?". Quem responde continua sendo o `js/pergunte.js`, com os
dados do site. A IA nunca produz números.

O site só chama a IA quando as palavras-chave não reconhecem a pergunta, ou quando o leitor toca em
"Não era isso?". Por isso o gasto é pequeno. Se a cota do dia acabar ou o Worker sair do ar, a caixa
continua funcionando só com as palavras-chave.

## Custo

O Workers AI tem uma cota gratuita diária. Passou dela no plano gratuito, os pedidos daquele dia falham
(sem cobrança) e o site volta a usar só as palavras-chave. Acompanhe o uso no painel da Cloudflare,
em **AI › Workers AI**. Se a cota estiver acabando, troque `MODELO` no `wrangler.toml` pelo modelo de 8B,
que gasta bem menos.

## Publicar (uma vez)

1. Crie uma conta gratuita em https://dash.cloudflare.com/sign-up.
2. Nesta pasta, rode:
   ```
   npx wrangler login
   npx wrangler deploy
   ```
   O `deploy` mostra o endereço do Worker, algo como `https://bussola-pergunte-ia.<sua-conta>.workers.dev`.
3. Cole esse endereço em `IA_URL`, no começo da seção "ajuda da IA" de `js/pergunte.js`.
4. Abra `testes/pergunte.html` pelo servidor local: os casos marcados com `[IA]` conferem o caminho completo
   (com uma IA de mentira, sem gastar a cota).

## Segurança

- Só aceita pedidos vindos de `bussoladaeducacao.com.br` e do servidor local (`localhost:8000`). Para outro
  endereço, acrescente-o em `ORIGENS`, no `worker.js`.
- A pergunta é cortada em 300 caracteres e a resposta em 120 tokens.
- A frase devolvida passa pelas palavras-chave do site como qualquer pergunta; se a IA inventar algo fora
  da lista de temas, a caixa responde "Ainda não sei responder essa".
- Nenhuma pergunta é guardada pelo Worker.
