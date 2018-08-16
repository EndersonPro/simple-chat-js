$(function () {
    const socket = io();
    var audio = new Audio('../sound/unconvinced.ogg');

    //Obteniendo los elementos del DOM desde la interfaz
    const $FormularioMensaje = $("#formulario-msj")
    var $Mensaje = $("#mensaje")
    const $Chat = $("#chat")

    //Username FORM
    const $nickForm = $("#nickForm")
    const $Error = $("#nickError")
    const $Nickname = $("#nickname")

    const $Usuarios = $('#usernames')

    /* Expresion regular para detectar enlaces de YouTube */
    const YouTubeRegex = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/


    $nickForm.on('submit',  e => {
        e.preventDefault()
        user = $Nickname.val()
        socket.emit('nuevo usuario', $Nickname.val(),  data => {
            
            (data) ? ($("#cont-username").hide(), $("#contentChat").show()) : $Error.html(`<div class="alert alert-danger">El usuario ya existe! </div>`)

            $Nickname.val('')
        })
    })

    function Texto(str) {
        return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    $FormularioMensaje.on('submit', function (e) {
        e.preventDefault();
        if(YouTubeRegex.test($Mensaje.val())){

            /* Busca dentro de string una expresion regular */
            var match = $Mensaje.val().match(YouTubeRegex)

            /* Armo la estructura basica para el mensaje del video en el chat */
            var htmlYoutube = `<div class="row">
                                <div class="col-md-6"></div>
                                <div class="col-md-6">
                                <div class="video alert alert-primary" role="alert">
                                <iframe src="https://www.youtube.com/embed/${match[5]}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
                                </div>
                                </div>`

            $Chat.append(htmlYoutube)
            socket.emit('enviadoYouTube', match[5])
        }else{
            socket.emit('enviado', Texto($Mensaje.val()))
            $Chat.append(`<div class="row">
            <div class="col-md-6"></div>
            <div class="col-md-6">
            <div class="alert alert-primary" role="alert">
                <span>${Texto($Mensaje.val())}</span></div>
            </div>
            </div>`)
        }
        $Mensaje.val('')
        $('#chat').scrollTop($('#chat').get(0).scrollHeight)
    })

    socket.on('nuevo mensaje', datos => {
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

        $('#chat').scrollTop($('#chat').get(0).scrollHeight)
    })
    socket.on('nuevo mensaje urlYoutube', function (datos) {
        if (datos.sound) { audio.play(); }
        var htmlYoutube = `<div class="row">
            <p><strong>${datos.nick}:</strong></p>
            <div class="col-md-6">
            <div class="video alert alert-primary" role="alert">
            <iframe src="https://www.youtube.com/embed/${datos.mensaje}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
            </div>
            <div class="col-md-6"></div>
            </div>`
        $Chat.append(htmlYoutube)

        $('#chat').scrollTop($('#chat').get(0).scrollHeight);
    })

    $Mensaje.on('keyup', function (e) {
        if ($(this).length > 0) {
            socket.emit('escribiendo', user, function (data) { })
        }
    })

    function clearTyping() {
        $("#Escribiendo").html('.')
    }



    socket.on('userWriting', function (data) {
        $("#Escribiendo").html(data)
        setTimeout(clearTyping, 3000);
    })



    socket.on('usernames', function (datos) {
        let html = ''
        for (let i = 0; i < datos.length; i++) {
            html += `<p><i class="fas fa-user"></i> ${datos[i]}</p>`
        }
        $Usuarios.html(html)
    })

})