# Education Backoffice

Esse projeto é uma mini aplicação contendo alguns endpoints para o Backoffice, sendo eles listados abaixo.

Alguns design patterns foram usados,são eles:

1. Decorators.
2. Singleton.
3. Adapter.

`seguindo algumas boas praticas do SOLID como:`

1. Single Responsibility,
2. Dependency Inversion.
3. Interface Segregation.

`Todos os controllers e services foram devidamente testados com jest.`

## Instalação

Certifique-se de ter o Docker instalado e rodando na sua maquina.

Crie um arquivo .env e cole esses dados:

```
AWS_ACCESS_KEY_ID='DUMMYIDEXAMPLE'
AWS_SECRET_ACCESS_KEY='DUMMYEXAMPLEKEY'
DB_REGION=eu-west-1
DB_URI=http://dynamodb-local:8000
DYNAMO_TABLE=UniTechBackOffice
SECRET_KEY=Unit3ch8ack0ffic3
```

Em seguida, execute o seguinte comando:

```bash
docker-compose up --build
```

# Observações

Criar username sem espaço
ex.  
"DOUGLAS GODOY" (maneira nao recomendada).  
"DOUGLAS" (maneira recomendada).  
"DOUGLAS_GODOY" (maneira recomendada).

# Requisitos

Cadastro (deverá ficar pendente, aguardando aprovação) (ok)

```JSON
curl --request POST \
 --url http://localhost:3000/teacher \
 --header 'Content-Type: application/json' \
 --header 'User-Agent: insomnia/8.4.0' \
 --data '{
	"username": "DOUGLAS",
	"password":"12345"
}'
```

• Login (ok)

```JSON
curl --request POST \
 --url http://localhost:3000/signin \
 --header 'Content-Type: application/json' \
 --header 'User-Agent: insomnia/8.4.0' \
 --data '{
	"username": "DOUGLAS",
	"password":"12345"
}'
```

• Lista de aulas (listar somente as aulas do professor relacionado ao token de acesso). (ok)

```JSON

curl --request GET \
 --url http://localhost:3000/classes/:teacherId \
 --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiNmFiMmI1MjEtNjI1Yi00NDYxLWJmMWYtMmFmZGI1YzljN2E2IiwidXNlck5hbWUiOiJkb3VnbGFzIn0sImlhdCI6MTcwNzQ4MjEyNiwiZXhwIjoxNzA3NjU0OTI2fQ.e2XSCON1JKZ5V1iLlyyrC3x0gkTDH8jlXmOIdA8c5Wg' \
 --header 'User-Agent: insomnia/8.4.0'
```

• Cadastro de novas aulas (criação e edição). (ok)

```JSON
curl --request POST \
 --url http://localhost:3000/class \
 --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiOTFjNzdkNDYtNzc3OS00NTk3LTljZWYtNTgzNmNhNTc3MDU5IiwidXNlck5hbWUiOiJET1VHTEFTIEFMRVhBTkRSRSBHT0RPWSBDQVJET1NPIn0sImlhdCI6MTcwNzUwOTk1NywiZXhwIjoxNzA3NjgyNzU3fQ.sJ7EvxIeUdkuMgu4LuxovLDSjEoa3He6smOKTUZNZus' \
 --header 'Content-Type: application/json' \
 --header 'User-Agent: insomnia/8.4.0' \
 --data '{
	"title": "THE SECOND CLASS TITLE",
	"description": "THIS IS A BEATIFUL DESCRIPTION ABOUT THE CLASS",
	"classDate": "02/10/2024"
}'
```

```JSON
curl --request PATCH \
 --url http://localhost:3000/class/:classId \
 --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7ImlkIjoiNmFiMmI1MjEtNjI1Yi00NDYxLWJmMWYtMmFmZGI1YzljN2E2IiwidXNlck5hbWUiOiJkb3VnbGFzIn0sImlhdCI6MTcwNzQ4MjEyNiwiZXhwIjoxNzA3NjU0OTI2fQ.e2XSCON1JKZ5V1iLlyyrC3x0gkTDH8jlXmOIdA8c5Wg' \
 --header 'Content-Type: application/json' \
 --header 'User-Agent: insomnia/8.4.0' \
 --data '{
	"classDate":"11/03/2024"
}'
```

### A aula é composta dos seguintes dados:

• Título. (ok)  
• Descrição. (ok)  
• Data prevista para aula. (ok)

Disponibilize em sua API um recurso para aprovar o cadastro de um professor. (ok)

```JSON
curl --request PATCH \
--url http://localhost:3000/teacher \
--header 'Content-Type: application/json' \
--header 'User-Agent: insomnia/8.4.0' \
--data '{
	"id": "teacherId"
}'
```

### Requisitos não funcionais:

• Utilizar conceito de JWT. O payload do JWT deve possuir o código e nome do professor. (ok)

• Utilize um banco de dados não relacional. (ok).
`DYNAMODB`

• Planeje uma solução para resolver a preocupação de situações de alta demanda. (ok) `clusterização`

# Melhorias

A primeira coisa que poderia ser melhorada é a validação dos inputs que chegam nas rotas, uma boa biblioteca para fazer essas validações é o zod (https://www.npmjs.com/package/zod).

Outra coisa que é muito importante termos alem dos testes unitários são os testes de integração, testando o fluxo completo de um endpoint. Uma boa biblioteca para isso é o supertest (https://www.npmjs.com/package/supertest)

A abordagem que usei para escalar a aplicação foi usar clusters para criar forks de acordo com a quantidade de processadores, mas podemos usar tambem ECS da amazon que pode escalar a aplicação de acordo com o trafego automaticamente, e tambem temos a opção de fazer as chamadas serverless usando lambda com api gateway, dessa maneira é automaticamente escalavel e a empresa só paga o que usar. O mesmo caso para escalar o Dynamo, ele tem duas opções de configuração, a primeira é colocando a quantidade de leitura e escrita limite, a outra é pagar por request.

## ESTRURA DO BANCO DE DADOS

```JSON
{
      TableName: <string>process.env.DYNAMO_TABLE,

      AttributeDefinitions: [
        { AttributeName: 'PK', AttributeType: 'S' },
        { AttributeName: 'SK', AttributeType: 'S' },
        { AttributeName: 'DateClass', AttributeType: 'S' },
        { AttributeName: 'ClassTitle', AttributeType: 'S' },
        { AttributeName: 'Status', AttributeType: 'S' },
        { AttributeName: 'Username', AttributeType: 'S' },
      ],
      KeySchema: [
        { AttributeName: 'PK', KeyType: 'HASH' }, // Partition Key
        { AttributeName: 'SK', KeyType: 'RANGE' },
      ],
      GlobalSecondaryIndexes: [
        {
          IndexName: 'GSI-SK',
          KeySchema: [{ AttributeName: 'SK', KeyType: 'HASH' }],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
        {
          IndexName: 'GSI-Status',
          KeySchema: [
            { AttributeName: 'SK', KeyType: 'HASH' },
            { AttributeName: 'Status', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
        {
          IndexName: 'GSI-DateClass',
          KeySchema: [
            { AttributeName: 'SK', KeyType: 'HASH' },
            { AttributeName: 'DateClass', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
        {
          IndexName: 'GSI-ClassTitle',
          KeySchema: [
            { AttributeName: 'SK', KeyType: 'HASH' },
            { AttributeName: 'ClassTitle', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
        {
          IndexName: 'GSI-Username',
          KeySchema: [
            { AttributeName: 'SK', KeyType: 'HASH' },
            { AttributeName: 'Username', KeyType: 'RANGE' },
          ],
          Projection: {
            ProjectionType: 'ALL',
          },
          ProvisionedThroughput: {
            ReadCapacityUnits: 2,
            WriteCapacityUnits: 2,
          },
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 5,
      },
    }
```
