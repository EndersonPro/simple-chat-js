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
            let Escribiendo = user + " está escribiendo..."
            socket.broadcast.emit('userWriting', Escribiendo)
        })

        socket.on('enviado', function (datos) {
            socket.broadcast.emit('nuevo mensaje', {
                mensaje: datos,
                nick: socket.nickname,
                sound:true
            })
        });

        socket.on('disconnect', function(datos){
            if(!socket.nickname) return;
            nicknames.splice(nicknames.indexOf(socket.nickname), 1)
            io.sockets.emit('usernames', nicknames);
        })
    })
}