require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const moment = require('moment-timezone')

const app = express()

const timeZone = 'America/Sao_Paulo'


// Config JSON response
app.use(express.json())

// Models
const User = require('./models/User')

// Open Route
app.get('/', (req, res) => {
  res.status(200).json({ msg: 'API RESTFUL desafio tecnico!' })
})

// Close Route
app.get('/user/:id', checkToken, async (req, res) => {
  const id = req.params.id

  // Check if user exists
  try {
    const user = await User.findById(id, '-password -createdAt -updatedAt');
    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    res.status(200).json({ user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensagem: 'Erro ao buscar o usuário' });
  }
})

function checkToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ mensagem: 'Não autorizado' })
  }

  try {
    const secret = process.env.SECRET
    jwt.verify(token, secret)
    next()
  } catch (error) {
    res.status(401).json({ mensagem: 'Token inválido!' })
  }
}

// Register User
app.post('/auth/register', async (req, res) => {
  const { name, email, password, phone } = req.body

  // Validations
  if (!name || !email || !password || !phone || !phone.ddd || !phone.numero) {
    return res.json({ mensagem: 'Todos os campos são obrigatórios' })
  }

  // Check if user exists
  try {
    const userExists = await User.findOne({ email: email })
    if (userExists) {
      return res.json({ mensagem: 'E-mail já existente' })
    }

    // Create hash password
    const salt = await bcrypt.genSalt(12)
    const passwordHash = await bcrypt.hash(password, salt)

    // Create user
    const user = new User({
      name,
      email,
      password: passwordHash,
      phone: {
        ddd: phone.ddd,
        numero: phone.numero,
      },
    })

    user.lastlogin = new Date();
    await user.save();

    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret,
      {
        expiresIn: '30m',
      }
    )

    const responseData = {
      id: user._id,
      data_criacao: moment(user.createdAt).tz(timeZone).format(),
      data_atualizacao: moment(user.updatedAt).tz(timeZone).format(),
      ultimo_login: moment(user.lastlogin).tz(timeZone).format(),
      token: token,
      mensagem: 'Usuário criado com sucesso',
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro ao criar o usuário' });
  }
});

// Authentication user
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ mensagem: 'Todos os campos devem ser preenchidos' });
  }

  // Check if user exists
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ mensagem: 'Usuário e/ou senha inválidos' });
    }

    // Check password
    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });
    }

    const secret = process.env.SECRET;
    const token = jwt.sign(
      {
        id: user._id,
      },
      secret,
      {
        expiresIn: '30m',
      }
    )
    
    // Update last login date
    user.lastlogin = new Date()
    
    
    const responseData = {
      id: user._id,
      data_criacao: moment(user.createdAt).tz(timeZone).format(),
      data_atualizacao: moment(user.updatedAt).tz(timeZone).format(),
      ultimo_login: moment(user.lastlogin).tz(timeZone).format(),
      token: token,
      mensagem: 'Autenticação realizada com sucesso',
    }
    
    await user.save();

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensagem: 'Erro na autenticação' });
  }
});

// Credentials
const dbUser = process.env.DB_USER;
console.log(dbUser)
const dbPassword = process.env.DB_PASS;
console.log(dbPassword)
mongoose
  .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.vflvxzh.mongodb.net/?retryWrites=true&w=majority`)
  .then(() => {
    const PORT = process.env.PORT || 3000;

    app.listen(PORT, () => {
      console.log(`Servidor ouvindo na porta ${PORT}`);
    });
  })
  .catch((err) => console.log('Usuário e/ou senha inválidos'));

module.exports = app;
