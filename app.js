const express=require('express');
const mongoose=require('mongoose');
const path=require('path');
const crypto=require('crypto-js');
const app=express();
require('dotenv').config();
const port=process.env.PORT || 3000;
const url=process.env.database;
mongoose.connect(url)//medoto de conexion a la base de datos
.then(()=>
{
    console.log("Database online...");
})
.catch((err)=>
{
    console.log("Error to connect database..."+err);
});
const usuarioSchema=new mongoose.Schema({//configuracion del modelo y eschema de usuario para la base de datos
    email:{type:String, required:true},
    password:{type:String, required:true},
    pushClient:{type:Object}
});
const productoSchema=new mongoose.Schema({
    name:{type:String, required:true},
    presio:{type:Number, required:true},
    stock:{type:Number, required:true},
    images:{type:Array}
});
const ProductModel=mongoose.model('producto', productoSchema);
const UserModel=mongoose.model('usuario', usuarioSchema);
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({extended:true}));
//rutas de obtencion de datos
app.get('/', (req, res)=>
{
    res.render('inicio');
});
app.get('/acerca', (req, res)=>
{
    res.render('acercade');
})
app.get('/producto/:name', (req, res)=>
{
    var producto=req.params.name;
    if(producto=="doormaid")
    {
        res.render('doormaid');
    }
    else if(producto=="servmaid")
    {
        //
    }
    else
    {
        res.redirect('/unknow');
    }
})
//rutas de recepcion de datos
app.post('/signUp', (req, res)=>//ruta de registro de usuarios
{
    UserModel.findOne({email:req.body.email})//consulta a la base de datos
    .then((usu)=>
    {
        console.log(usu);
        if(!usu)
        {
            var newUser=new UserModel({//creacion de nuevo documento
                email:req.body.email,
                password:crypto.AES.encrypt(req.body.password, 'secretkeytodecryptpasswordandinformation').toString()
            });
            newUser.save()
            .then((newUsu)=>
            {
                res.render('gracias');
            })
            .catch((err)=>
            {
                console.log(err);
                res.render('error', {mensaje:"Ha ocurrido un error al registrar al usuario, intentelo mas tarde"});
            });
        }
        else
        {
            res.render('gracias');
        }
    })
    .catch((err)=>
    {
        console.log(err);
        res.render('error', {mensaje:"Ha ocurrido un error con la base de datos, intentelo mas tarde"});
    });
});
app.post('/producto/:name', (req, res)=>
{
    console.log(req.params.name);
    console.log(req.body);
    Product
});
app.post
app.get('*', (req, res)=>
{
    res.render('notFound');
});
app.listen(port, ()=>
{
    console.log("Server runing on port "+port+"...");
});