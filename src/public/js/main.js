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

    function Texto(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    $FormularioMensaje.on('submit', function (e) {
        e.preventDefault();
        socket.emit('enviado', Texto($Mensaje.val()))
        $Chat.append(`<div class="row">
                        <div class="col-md-6"></div>
                        <div class="col-md-6">
                        <div class="alert alert-primary" role="alert">
                            <span>${Texto($Mensaje.val())}</span></div>
                        </div>
                        </div>`)
        $Mensaje.val('')
        $('#chat').animate({
            scrollTop: $('#chat').get(0).scrollHeight
        }, 500);
    })

    socket.on('nuevo mensaje', function (datos) {
        if (datos.sound) { audio.play(); }
        $Chat.append(`
        
        <div class="row">
        <div class="col-md-6">
        <div class="alert alert-success" role="alert">
            <strong>${datos.nick}:</strong> <span>${datos.mensaje}</span></div>
        </div>
        <div class="col-md-6"></div>
        </div>
        
        `)

        $('#chat').animate({
            scrollTop: $('#chat').get(0).scrollHeight
        }, 500);
    })

    $Mensaje.on('keyup', function (e) {
        if ($(this).length > 0) {
            socket.emit('escribiendo', user, function (data) { })
        }
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