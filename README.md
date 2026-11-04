# AquaZen Piscinas

Site institucional responsivo para uma empresa fictícia de limpeza, tratamento e manutenção de piscinas. A página reúne uma experiência de rolagem cinematográfica, comparador visual demonstrativo, serviços, diferenciais, processo, galeria e formulário de orçamento.

## Requisitos

- Node.js 20.9 ou superior.
- npm.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. Os comandos `npm run lint`, `npm run typecheck` e `npm run build` verificam o projeto.

## Configuração de contato e redes sociais

O formulário abre uma conversa do WhatsApp com os dados preenchidos. Para habilitar o contato:

1. Copie `.env.example` para `.env.local`.
2. Preencha `NEXT_PUBLIC_WHATSAPP_NUMBER` com o número oficial no formato internacional, somente com dígitos, incluindo código do país e DDD.
3. Opcionalmente, preencha os links oficiais de Instagram, Facebook e YouTube.
4. Reinicie o servidor de desenvolvimento.

Sem o número, o formulário informa que nenhum dado foi enviado e apresenta a instrução de configuração. Links sociais só são exibidos quando seus perfis oficiais são configurados.

## Organização

- `src/app`: App Router, metadados e estilos globais.
- `src/components`: identidade visual e componentes interativos.
- `src/data`: serviços, etapas e imagens da galeria.
- `src/lib`: configuração e utilitários.
- `public`: favicon e recursos estáticos.

O hero usa a animação Canvas interativa da piscina, com o preenchimento e o esvaziamento vinculados à rolagem. Com `prefers-reduced-motion` ativo, a animação permanece estática e acessível. O comparador usa as duas imagens de referência fornecidas pelo usuário (`comparison-pool-before.webp` e `comparison-pool-after.webp`); elas não representam um atendimento realizado pela AquaZen. As fotografias das demais seções foram baixadas do Unsplash para `public/images`; atualize os textos alternativos se forem substituídas.

## Animação Animorio

A adaptação React de “The Pool That Fills Up”, da Animorio, compõe a abertura e preserva o Canvas, GSAP e ScrollTrigger; a piscina acompanha a rolagem nos dois sentidos. Consulte os termos originais na pasta de arquivos fornecidos: uso comercial no próprio site é permitido; revenda e redistribuição da animação não são permitidas. GSAP e ScrollTrigger permanecem sujeitos à licença própria.
