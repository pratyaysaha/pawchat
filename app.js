//imports
const express= require('express')
const mongoose=require('mongoose')
const sessions=require('express-session')
const MongoStore=require('connect-mongo')

const apiroute=require('./routes/apiroute')
require('dotenv/config')
//constants and globals
const app = express()
const server=require('http').createServer(app)
const io=require('socket.io')(server)


//middlewares
app.use(express.static(__dirname+'/css'))
app.use(express.static(__dirname+'/js'))
app.use(express.static(__dirname+'/images'))
app.set('view engine', 'ejs')

const IN_PROD= process.env.NODE_ENV==='production'
const SESSION_EXPIRE= Number(process.env.SESSION_AGE) * 60 * 60* 1000

app.use(sessions({
    name: process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    secret : process.env.SESSION_SECRET,
    store : MongoStore.create({
        mongoUrl : process.env.DB_CONNECTION,
    }),
    cookie:{
        sameSite : true,
        maxAge : SESSION_EXPIRE,
        secure : IN_PROD,
        httpOnly : false
    }
}))


//page middlewares

app.use('/api',apiroute)
const redirectToLogin= (req,res,next)=>{
    if(!req.session.islogged)
    {
        res.redirect('/login')
    }
    else
    {
        next()
    }
}
app.use((req,res,next)=>{
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next()
})

//routes
app.get('/',redirectToLogin, (req,res)=>{
    res.render('index',{userDetails : req.session.userDetails})
})

app.get('/test',redirectToLogin,(req,res)=>{
    res.render('test')
})
app.get('/signup',(req,res)=>{
    res.render('signup')
})
app.get('/login',(req,res)=>{
    res.render('login')
})
//mongoose connection
mongoose.connect(process.env.DB_CONNECTION,{ 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
})
//port listening
server.listen(process.env.PORT || 3000)