import { faker } from "@faker-js/faker"
import { Router } from 'express'
faker.locale = "es"
const router = Router()

router.get('/productos-test', (req, res) => {
    const cant = 5
    const arrayProductos = []

    for (let i = 0; i < cant; i++) {
        const producto = {
            nombre: faker.commerce.productName(),
            precio: faker.commerce.price(),
            imagen: faker.image.imageUrl(),
            id: i+1
        }
        arrayProductos.push(producto)
    }
    res.json(arrayProductos)
})

export default router