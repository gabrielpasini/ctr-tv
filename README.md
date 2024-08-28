# 🏁 CTR-TV

Este projeto tem como foco o desenvolvimento de um website e api para organização de torneios de Crash Team Racing.

## Instruções de Instalação de Dependências

Este projeto é dividido em duas partes: **frontend** e **backend**. Cada parte tem suas próprias dependências que precisam ser instaladas.

### 1. Tecnologias usadas

#### 1.1 Frontend

1. React
2. Typescript
3. Tailwind

#### 1.2 Backend

1. Node
2. Javascript
3. Express
4. MongoDB

### 2. Instalação das dependencias do Frontend e Backend

Acesse as pastas do `frontend` ou `backend`:

```bash
cd frontend
```

ou 

```bash
cd backend
```


Apos isto instale as dependencias usando o yarn, este processo precisa ser repetido para ambas as pastas:

```
yarn
```


### 3. Criando arquivo .env

Para o backend é necessario criar um arquivo .env com a chave do banco local para utiliza-lo, após instalar o mongodb, crie um arquivo .env na pasta do backend e coloque a chave do banco, como no exemplo abaixo.

```
MONGO_DB = "Chave do banco"
```

### 4. Rodando o projeto

O frontend e backend pode ser executado com o seguinte comando nas respectivas pastas de cada um:

```
yarn dev
```

### 5. Trabalhos futuros
- Integração com o CTR Online para fins de feedback em tempo real por meio de uma api.
