<h1 aling="center">
    API RESTful Authentication 
</h1>

<p aling="center">
    Está API foi criada no intuito de criar, autenticar e retornar informações de usuários.
</p>

<p>
A API foi desenvolvida seguindo os requisitos impostos que são: Persistência de dados, sistema de build com gerenciamento de dependências, task runner, padronização de 
estilo e framework.
Foi cumprido também todos os requisitos desejáveis que são: JWT como token, testes unitários e criptografia hash.
A hospedagem foi feita no Heroku e pode ser acessado no link https://salty-spire-35972-d74c8aa62fe1.herokuapp.com/
</p>

<p>
Para fazer a criação do usuário deve inserir (nome, email, senha e telefone) sendo que no telefone você deverá inserir o ddd e o numero de telefone separado, após efetuar a criação pode fazer o login no qual ele retornará o (id, data de criação, data de atualização, data do último login e o token). Em seguida na close route que deve ser acessada com o id do usuário, ele irá retornar as informações do próprio usuário.
</p>