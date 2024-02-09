# Nome do Seu Projeto

Descrição concisa do seu projeto.

## Instalação

Certifique-se de ter o Docker instalado e rodando na sua maquina.

Crie um arquivo .env e cole esses dados:

AWS_ACCESS_KEY_ID='DUMMYIDEXAMPLE'
AWS_SECRET_ACCESS_KEY='DUMMYEXAMPLEKEY'
DB_REGION=eu-west-1
DB_URI=http://dynamodb-local:8000
DYNAMO_TABLE=UniTechBackOffice
SECRET_KEY=Unit3ch8ack0ffic3

Em seguida, execute o seguinte comando:

```bash
docker-compose up --build
```

Rotas
Criação de Professor
Endpoint: POST /teacher
Descrição: Cria um novo professor.
Corpo da Requisição:

```JSON
{
  "username": "nome_do_usuario",
  "password": "senha_do_usuario"
}
Resposta de Sucesso:
Código: 201
Conteúdo:
```

```JSON
{
  "message": "Professor criado com sucesso"
}
Obtenção de Informações do Professor
Endpoint: GET /teacher/:userName
Descrição: Obtém informações de um professor pelo nome de usuário.
Parâmetros de Rota:
userName: Nome de usuário do professor.
Respostas:
Código 200: Informações do professor obtidas com sucesso.
```

```JSON
{
  "id": "id_do_professor",
  "username": "nome_do_usuario",
  "status": "status_do_professor"
}
```

Código 404: Professor não encontrado.

```JSON
{
  "error": "Professor não encontrado"
}
```

Autenticação de Professor
Endpoint: POST /signin
Descrição: Autentica um professor.
Corpo da Requisição:

```JSON
{
  "username": "nome_do_usuario",
  "password": "senha_do_usuario"
}
```

Respostas:
Código 200: Professor autenticado com sucesso.

```JSON
{
  "id": "id_do_professor",
  "username": "nome_do_usuario",
  "token": "token_de_autenticacao"
}
```

Código 400: Falha na autenticação.

```JSON
{
  "error": "Falha na autenticação"
}
```

Código 401: Professor não autorizado.

```JSON
{
  "error": "Professor não autorizado"
}
```

Código 500: Erro interno do servidor.

```JSON
{
  "error": "Erro interno do servidor"
}
```

Atualização de Status do Professor
Endpoint: PATCH /teacher
Descrição: Atualiza o status do professor.
Corpo da Requisição:

```JSON
{
  "id": "id_do_professor"
}
```

Respostas:
Código 200: Status do professor atualizado com sucesso.

```JSON
{
  "id": "id_do_professor",
  "status": "novo_status"
}
```

Criação de Nova Aula
Endpoint: POST /class
Descrição: Cria uma nova aula.
Cabeçalho da Requisição: Authorization: Bearer token_de_autenticacao
Corpo da Requisição:

```JSON
{
  "title": "titulo_da_aula",
  "description": "descricao_da_aula",
  "classDate": "data_da_aula"
}
```

Respostas:
Código 201: Aula criada com sucesso.

```JSON
{
  "id": "id_da_aula",
  "title": "titulo_da_aula",
  "description": "descricao_da_aula",
  "classDate": "data_da_aula"
}
```

Obtenção de Aulas por Professor
Endpoint: GET /classes/:teacherId
Descrição: Obtém aulas de um professor.
Cabeçalho da Requisição: Authorization: Bearer token_de_autenticacao
Parâmetros de Rota:
teacherId: ID do professor.
Respostas:
Código 200: Aulas obtidas com sucesso.

```JSON
{
  "classes": [
    {
      "id": "id_da_aula",
      "title": "titulo_da_aula",
      "description": "descricao_da_aula",
      "classDate": "data_da_aula"
    }
  ]
}
```

Código 204: Nenhuma aula encontrada.

```JSON
{
  "message": "Nenhuma aula encontrada"
}
```

Atualização de Aula por ID
Endpoint: PATCH /class/:classId
Descrição: Atualiza uma aula por ID.
Cabeçalho da Requisição: Authorization: Bearer token_de_autenticacao
Parâmetros de Rota:
classId: ID da aula.
Corpo da Requisição:

```JSON
{
  "title": "novo_titulo_da_aula",
  "description": "nova_descricao_da_aula",
  "classDate": "nova_data_da_aula"
}
```

Respostas:
Código 200: Aula atualizada com sucesso.

```JSON
{
  "id": "id_da_aula",
  "title": "novo_titulo_da_aula",
  "description": "nova_descricao_da_aula",
  "classDate": "nova_data_da_aula"
}
```
