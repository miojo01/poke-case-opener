# 🥚 PokéCase - CS2 Style Gacha

Um simulador de abertura de caixas (Gacha) inspirado na mecânica do Counter-Strike 2, mas com Pokémon. O projeto utiliza a **PokeAPI** para buscar dados reais e um servidor local para persistir o progresso do usuário.

## 🎮 Funcionalidades

* **Roleta Animada:** Sistema visual idêntico ao CS2, onde a roleta gira e desacelera até parar no item sorteado.
* **Probabilidades Reais:**
    * 🔵 **Comum:** Alta chance, pokémons básicos.
    * 🟣 **Rara:** Chance média, evoluções e pokémons fortes.
    * 🟡 **Lendária:** Chance baixíssima (0.5% a 2%), apenas lendários.
* **Sistema de Economia:**
    * Botão "Trabalhar" para ganhar moedas.
    * Venda de itens do inventário com preços baseados na raridade.
* **Persistência de Dados:** Saldo e Coleção são salvos automaticamente no `db.json`.
* **Pokédex:** Marca quais pokémons da região de Kanto você já desbloqueou.
* **Efeitos Sonoros:** Feedback de áudio para cliques, roleta e vitórias.

## 🚀 Tecnologias Utilizadas

* [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
* CSS3 (Animações Keyframes e Flexbox)
* JSON Server (Simulação de Backend API)
* Fetch API (Consumo de dados)

## 📦 Como Rodar o Projeto

Este projeto precisa de dois terminais rodando simultaneamente (um para o site e outro para o banco de dados falso).

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.

### Passo 1: Instalação
Clone o repositório e instale as dependências:
```bash
npm install

### Passo 2: Iniciar o Backend (JSON Server)
Em um terminal, execute:
```bash
npx json-server --watch db.json --port 3000
ou
npm run api

### Passo 3: Iniciar o Frontend
Em outro terminal, execute:
```bash
npm run dev



