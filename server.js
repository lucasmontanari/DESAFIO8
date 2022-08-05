import express from 'express'
const app = express()
import path from 'path'
import { Server } from 'socket.io'
const expressServer = app.listen(8080, () => console.log('Servidor escuchando puerto 8080'))
const io = new Server(expressServer)
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import rutas from './routes/rutas.js'
import { schema, normalize } from "normalizr";


const __dirname = dirname(fileURLToPath(import.meta.url));

import ContenedorMensaje from './dao/MensajeDaoMongoDb.js'
const mensajes = new ContenedorMensaje()

let mensajesEnBaseDeDatos=[]

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use('/public', express.static(`${__dirname}/public`))
app.use(express.static(path.join(__dirname, './public')))

app.use('/api/', rutas)

//NORMALIZR

const author = new schema.Entity("author", {}, { idAttribute: "userEmail" });

const mensaje = new schema.Entity(
  "mensaje",
  { author: author },
  { idAttribute: "_id" }
);

const schemaMensajes = new schema.Entity(
  "mensajes",
  {
    mensajes: [mensaje],
  },
  { idAttribute: "id" }
);


io.on('connection', async socket => {
    console.log(`Se conecto un usuario ${socket.id}`)
    try{
        mensajesEnBaseDeDatos = await mensajes.getAll()
        const normalizedMensajes = normalize(
            { id: "mensajes", mensajes: mensajesEnBaseDeDatos },
            schemaMensajes
        );
        socket.emit('server:mensajes', normalizedMensajes)
    }catch(error){
        console.log(`Error al adquirir los mensajes ${error}`)
    }
    socket.on('cliente:mensaje', async nuevoMensaje => {
        console.log(nuevoMensaje)
        await mensajes.save(nuevoMensaje)
        mensajesEnBaseDeDatos = await mensajes.getAll()
        console.log(mensajesEnBaseDeDatos)
        const normalizedMensajes = normalize(
            { id: "mensajes", mensajes: mensajesEnBaseDeDatos },
            schemaMensajes
        );
        io.emit('server:mensajes', normalizedMensajes)
    })
})