require('dotenv').config();

const bodyParser   = require('body-parser');
const cors         = require('cors');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const logger       = require('morgan');
const mongoose     = require('mongoose');
const path         = require('path');

const authRoutes   = require('./routes/auth-routes');
const accountRoutes= require('./routes/account-routes');

// WHEN INTRODUCING USERS DO THIS:
// INSTALL THESE DEPENDENCIES: bcryptjs, express-session
// AND UN-COMMENT OUT FOLLOWING LINES:
const session       = require('express-session');
const MongoStore   = require('connect-mongo')(session);

mongoose.connect(process.env.MONGODB_URI, {
  keepAlive: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log(`Connected to database`);
}).catch((error) => {
  console.error(error);
})

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));    

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// ADD SESSION SETTINGS HERE:
app.use(session({
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  }),
  secret: process.env.SECRET_SESSION,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// ADD CORS SETTINGS HERE TO ALLOW CROSS-ORIGIN INTERACTION:
app.use(cors({
  credentials: true,
  origin: [process.env.PUBLIC_DOMAIN]
}));

// ROUTES MIDDLEWARE STARTS HERE:
app.use('/api', authRoutes);
app.use('/api', accountRoutes);


module.exports = app;
