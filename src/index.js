const http = require('http')
const path = require('path')

const express = require('express');
const socket = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socket.listen(server);

//configurando puerto
app.set('port', process.env.PORT || 3000);

/* Requiero la funcion  */
require('./socket')(io);


// Enviado archivos estaticos al cliente
app.use(express.static(path.join(__dirname,'public')));

//Empezando el servidor
server.listen(app.get('port'),()=>{
    console.log('Server on port ', app.get('port'));
})