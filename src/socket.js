module.exports = function (io) {

    let nicknames = []

    io.on('connection', socket => {
        console.log("Nuevo usuario conectado")

        socket.on('nuevo usuario', function (datos, cb) {
            console.log(datos)
            if (nicknames.indexOf(datos) != -1){
                cb(false)
            }else{
                cb(true)
                socket.nickname = datos
                nicknames.push(socket.nickname)
                io.sockets.emit('usernames', nicknames);
            }
        });

        socket.on('escribiendo',function(user){
            console.log(user)
            let Escribiendo = user + " está escribiendo..."
            io.sockets.emit('userWriting', Escribiendo)
        })

        socket.on('enviado', function (datos) {
            io.sockets.emit('nuevo mensaje', {
                mensaje: datos,
                nick: socket.nickname
                
            })
        });

        socket.on('disconnect', function(datos){
            if(!socket.nickname) return;
            nicknames.splice(nicknames.indexOf(socket.nickname), 1)
            io.sockets.emit('usernames', nicknames);
        })
    })
}