const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Certifique-se de ajustar o caminho conforme a estrutura do seu projeto.

chai.use(chaiHttp);
const expect = chai.expect;

describe('User API', () => {
    let authToken; // Variável para armazenar o token

    before(async () => {
      // Autentica um usuário e obtém um token
      const res = await chai
        .request(app)
        .post('/auth/login')
        .send({
          email: 'desenvolvedorlu@gmail.com',
          password: '32257584',
        });
  
      authToken = res.body.token;
    });

    
      it('Deve retornar todos os usuários', (done) => {
        chai
          .request(app)
          .get('/user/655d2df3436a5314eda0c612')
          .set('Authorization', `Bearer ${authToken}`) // Adicione o token ao cabeçalho da solicitação
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('user');
            done();
          });
      });

    it('Deve criar um novo usuário', (done) => {
        chai
          .request(app)
          .post('/auth/register')
          .send({
            name: 'Antonio de Oliveira Guilherme',
            email: 'tiozin.guilherme106@gmail.com',
            password: 'Luanderson@',
            phone: { ddd: '32', numero: '99994-1716' },
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.property('token');
            done();
          });
      });

});
