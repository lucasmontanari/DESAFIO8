const socket = io()
const formMensajes = document.querySelector('#formMensajes')
const email = document.querySelector('#email')
const nombre = document.querySelector('#nombre')
const apellido = document.querySelector('#apellido')
const edad = document.querySelector('#edad')
const alias = document.querySelector('#alias')
const avatar = document.querySelector('#avatar')
const mensaje = document.querySelector('#mensaje')

//MENSAJES
async function renderMensajes(mensajes) {
        const response = await fetch('./mensajes.ejs')
        const plantilla = await response.text()
        document.querySelector('#chat').innerHTML = ''
        mensajes.forEach(mensaje => {
            const html = ejs.render(plantilla, mensaje)
            document.querySelector('#chat').innerHTML += html
        })
} 

socket.on('server:mensajes', mensajes => {
    console.log(mensajes)
    renderMensajes(mensajes)
})

formMensajes.addEventListener('submit', event => {
    event.preventDefault()
    fecha = new Date().toLocaleString()
    const nuevoMensaje = {
        "author": {
            "id":email.value,
            "nombre": nombre.value,
            "apellido": apellido.value,
            "edad": edad.value,
            "alias": alias.value,
            "avatar": avatar.value
        },
        "tiempoStamp": fecha,
        "text": mensaje.value
    }
    console.log(nuevoMensaje)
    socket.emit('cliente:mensaje', nuevoMensaje)
    mensaje.value = "" //Para limpiar el campo mensajes y poder escribir otro
})


