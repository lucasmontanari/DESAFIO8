const socket = io()
const formProductos = document.querySelector('#formProductos')
const producto = document.querySelector('#producto')
const precio = document.querySelector('#precio')
const imagen = document.querySelector('#imagen')
const formMensajes = document.querySelector('#formMensajes')
const email = document.querySelector('#email')
const mensaje = document.querySelector('#mensaje')

//PRODUCTOS
async function renderProducts(productos) {
    if(productos.length > 0){
        document.querySelector('#tabla').classList.remove('eliminarVista')
        const response = await fetch('./productos.ejs')
        const plantilla = await response.text()
        document.querySelector('#datos-productos').innerHTML = ''
        productos.forEach(product => {
            const html = ejs.render(plantilla, product)
            document.querySelector('#datos-productos').innerHTML += html
        })
        document.querySelector('#lista-vacia').classList+=' eliminarVista'
    }else{
        document.querySelector('#lista-vacia').classList.remove('eliminarVista')
        document.querySelector('#tabla').classList+=' eliminarVista'
    }
}

fetch('http://localhost:8080/api/productos-test')
  .then(response => response.json())
  .then(data => renderProducts(data));