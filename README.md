# Syndika — Escudo Jurídico (v1)

Plataforma para síndicos de condomínio. Antes de o síndico agir (demitir funcionário, aprovar obra, advertir morador, gasto extraordinário), o **Escudo Jurídico** classifica a ação, mostra o nível de risco com a base legal, gera o checklist do que é obrigatório e emite os documentos em PDF já preenchidos.

Projeto acadêmico (Projeto Integrador — ADS, CEUB), desenvolvido em parceria com uma síndica real. Esta é a **v1, protótipo validado**; a v2.0 (com login, banco, IA real e trilha de auditoria) está em planejamento.

## Como rodar

Não precisa instalar nada.

```bash
git clone <url-do-repo>
cd syndika
# abra index.html no navegador (duplo clique resolve)
```

Para testar só o motor de regras no terminal:

```bash
node syndika-engine.js
```

## Stack

| Camada | O que é |
|---|---|
| Linguagem | HTML, CSS e JavaScript puro (ES5) — um arquivo só, sem framework, sem build |
| PDF | [jsPDF 2.5.1](https://github.com/parallax/jsPDF) via CDN (cdnjs) |
| Fonte | Inter (Google Fonts) |
| Backend / banco | **Nenhum.** Tudo roda no navegador; nada é salvo |

## Tem IA?

**Não — ainda.** O que a interface chama de "IA jurídica" é um **motor de regras determinístico**:

- `TIPOS`: 6 tipos de ação (manutenção, obra, RH, advertência, financeiro, outro), cada um com risco, confiança, fontes legais, título, descrição e lista de documentos — tudo fixo.
- `CHECKLISTS`: os itens obrigatórios/recomendados por tipo, com a base legal de cada um.
- `KEYWORDS` + `detectarTipoPorTexto()`: classificação por palavras-chave no texto digitado (`porteiro`, `demitir` → RH; `fachada`, `obra` → Obra…). Cada palavra encontrada soma 2 pontos; vence o tipo com mais pontos.
- `formalizarTexto()`: troca gírias (`pra`, `tá`, `vc`), capitaliza e adiciona prefixo/sufixo jurídico por tipo.
- A animação de "consultando fontes…" é só visual (`setTimeout`).

Isso é a limitação principal da v1 e o motivo da v2.0 prever LLM + RAG sobre base legal curada.

## Estrutura

```
index.html             app completo (splash + Escudo Jurídico): CSS, HTML e JS inline
syndika-engine.js      o mesmo motor de regras, isolado e rodável com Node — ponto de partida para separar lógica da interface
modulo-financeiro.html módulo "Saúde Financeira" (SíndicoFácil), feito à parte e ainda não plugado no app
docs/                  material de apoio (resumo em PDF)
```

### Mapa do `index.html`

| Linhas (aprox.) | Conteúdo |
|---|---|
| 1–545 | CSS (tema dark, splash, sidebar, formulário, viewer de documento, calendário, mobile) |
| 552–663 | Tela splash |
| 668–902 | Shell do app: sidebar, página Escudo Jurídico, histórico (dados fictícios) |
| 905–970 | Viewer de documento (slide-over) e modal "Nova ação" |
| 976–1081 | **Motor de regras**: `TIPOS`, `CHECKLISTS`, `DOC_INFO`, `KEYWORDS` |
| 1083–1160 | Detecção de tipo, dados do condomínio |
| 1220–1317 | `analisarRisco()`, `renderResultado()`, `gerarDocumentos()` |
| 1320–1428 | Viewer HTML dos 4 documentos |
| 1518–1887 | Geração dos PDFs com jsPDF (ata, laudo, comunicado, checklist RC) |
| 1907–2000 | Calendário customizado |
| 2005–2071 | `formalizarTexto()` e preview ao digitar |

## Dados fictícios

Síndico "Carlos Silva", condomínio "Res. das Palmeiras" e o histórico de 3 ações são placeholders hardcoded (`sb-user-name`, `sb-condo-name`, `.history-item`).

## Como contribuir

1. Abra uma issue dizendo o que vai mexer (o arquivo é um só; evita conflito).
2. Crie uma branch a partir da `main` e abra um PR.
3. Boas primeiras tarefas:
   - separar CSS / HTML / JS em arquivos (o `syndika-engine.js` já é o começo do motor isolado);
   - trocar os dados fictícios por um formulário de "configurar condomínio";
   - persistir histórico em `localStorage`;
   - plugar o `modulo-financeiro.html` na sidebar.

## Aviso

Os documentos gerados são orientativos e não substituem consulta a um advogado. Base legal referenciada: Código Civil (arts. 1.331–1.358, 927), Lei 4.591/64, CLT, NBR 16.280, Lei 6.496/77.

## Autoria

João Pedro de Oliveira Nunes — Projeto Integrador, Análise e Desenvolvimento de Sistemas, CEUB. Contribuições externas são bem-vindas e serão creditadas no histórico de commits.
