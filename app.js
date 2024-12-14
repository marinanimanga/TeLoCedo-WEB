import express from 'express';
import bodyParser from 'body-parser'
import routes from './routes.js'

const app = express(); //iniciamos express

//Iniciamos el servidor
app.listen('3000', function(){
    console.log('Server started on port 3000');
});


//Configuración de archivos estáticos
app.use('/', express.static('vistas'));
app.use('/src', express.static('src'));
app.use('/css', express.static('css'));


app.use(bodyParser.json());
app.use('/', routes);

