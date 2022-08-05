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
async function renderMensajes(mensajes, compresion) {
    const response = await fetch('./mensajes.ejs')
    const plantilla = await response.text()
    document.querySelector('#chat').innerHTML = ''
    document.querySelector('#tituloChat').innerHTML = `Chat ${compresion}%`
    mensajes.forEach(mensaje => {
        const html = ejs.render(plantilla, mensaje._doc)
        document.querySelector('#chat').innerHTML += html
    })
}

//NORMALIZR
const schemaAuthor = new normalizr.schema.Entity(
    "author",
    {},
    { idAttribute: "userEmail" }
);

const schemaMensaje = new normalizr.schema.Entity(
    "mensaje",
    { author: schemaAuthor },
    { idAttribute: "id" }
);

const schemaMensajes = new normalizr.schema.Entity(
    "mensajes",
    {
        mensajes: [schemaMensaje],
    },
    { idAttribute: "id" }
);


socket.on('server:mensajes', mensajesNormalizados => {

    const denormalizado = normalizr.denormalize(
        mensajesNormalizados.result,
        schemaMensajes,
        mensajesNormalizados.entities
    );

    const compresion = Math.round(JSON.stringify(mensajesNormalizados).length/ JSON.stringify(denormalizado).length * 100 - 100)
    console.log(JSON.stringify(mensajesNormalizados).length)
    console.log(JSON.stringify(denormalizado).length)
    console.log(compresion)
    renderMensajes(denormalizado.mensajes, compresion)
})

formMensajes.addEventListener('submit', event => {
    event.preventDefault()
    fecha = new Date().toLocaleString()
    const nuevoMensaje = {
        "author": {
            "userEmail": email.value,
            "nombre": nombre.value,
            "apellido": apellido.value,
            "edad": edad.value,
            "alias": alias.value,
            "avatar": avatar.value
        },
        "tiempoStamp": fecha,
        "text": mensaje.value
    }
    socket.emit('cliente:mensaje', nuevoMensaje)
    mensaje.value = "" //Para limpiar el campo mensajes y poder escribir otro
})


