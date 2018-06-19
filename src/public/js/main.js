$(function () {
    const socket = io();
    var audio = new Audio('../sound/unconvinced.ogg');

    //Obteniendo los elementos del DOM desde la interfaz
    const $FormularioMensaje = $("#formulario-msj")
    const $Mensaje = $("#mensaje")
    const $Chat = $("#chat")

    //Username FORM
    const $nickForm = $("#nickForm")
    const $Error = $("#nickError")
    const $Nickname = $("#nickname")
    let user = 'algo'

    const $Usuarios = $('#usernames')



    $nickForm.on('submit', function (e) {
        e.preventDefault()
        user = $Nickname.val()
        socket.emit('nuevo usuario', $Nickname.val(), function (data) {
            if (data) {
                $("#cont-username").hide()
                $("#contentChat").show()
            } else {
                $Error.html(`
                    <div class="alert alert-danger">
                        El usuario ya existe!
                    </div>
                `)
            }
            $Nickname.val('')
        })
    })

    $FormularioMensaje.on('submit', function (e) {
        e.preventDefault();
        socket.emit('enviado', $Mensaje.val().split('').filter(c => (c != '<') && (c != '>')).join(''))
        $Mensaje.val('')
    })

    socket.on('nuevo mensaje', function (datos) {
        audio.play();
        $Chat.append(`<div class="alert alert-success" role="alert">
            <strong>${datos.nick}:</strong> <span>${datos.mensaje}</span></div>`)
        $('#chat').animate({
            scrollTop: $('#chat').get(0).scrollHeight
        }, 500);
    })

    $Mensaje.on('keyup', function (e) {
        socket.emit('escribiendo', user, function (data) { })
    })

    function clearEscribiendo() {
        $("#Escribiendo").html('.')
    }

    socket.on('userWriting', function (data) {
        $("#Escribiendo").html(data)
        setTimeout(clearEscribiendo, 3000);
    })



    socket.on('usernames', function (datos) {
        let html = ''
        for (let i = 0; i < datos.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${datos[i]}</p>`
        }
        $Usuarios.html(html)
    })

})