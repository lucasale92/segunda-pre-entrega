const { Router } = require('express')
const router = Router()
const mongoManager = require('../DAO/productManagerMongo/productMMongo.js')

router.get('/', async (req, res) => {
    try {
        const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = await mongoManager.getProduct(req.query)

        const prevUrl = req.originalUrl.endsWith("products") || req.originalUrl.endsWith("products/") ? `/api/products?page=${prevPage}` : req.originalUrl.includes("page") ? req.originalUrl.replace(`page=${page}`, `page=${prevPage}`) : `${req.originalUrl}&page=${prevPage}`
        const nextUrl = req.originalUrl.endsWith("products") || req.originalUrl.endsWith("products/") ? `/api/products?page=${nextPage}` : req.originalUrl.includes("page") ? req.originalUrl.replace(`page=${page}`, `page=${nextPage}`) : `${req.originalUrl}&page=${nextPage}`

        res.status(200).send({
            status: 'success',
            payload: docs,
            totalPages: totalPages,
            prevPage: prevPage,
            nextPage: nextPage,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: hasPrevPage ? prevUrl : null,
            nextLink: hasNextPage ? nextUrl : null
        })
    } catch (error) {
        return res.status(500).send({
            status: 'error',
            payload: error
        })
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const product = await mongoManager.getProduct(req.params)
        res.status(200).send({
            status: 'success',
            payload: product
        })
    } catch (error) {
        if (error) return res.status(500).send({
            status: 'error',
            payload: error
        })
    }
})

router.post('/', async (req, res) => {
    try {
        const newProduct = await mongoManager.createProduct(req.body)

        res.status(201).send({
            status: 'success',
            msg: "Productos Actualizados.",
            newProduct
        })
    } catch (error) {
        return res.status(400).send({
            status: `ERROR`,
            error
        })
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const update = await mongoManager.updateProduct(req.params, req.body)
        res.status(201).send({
            status: 'Sucess',
            payload: update
        })
    } catch (error) {
        if (error) {
            return res.status(500).send({
                status: "Error",
                payload: error
            })
        }
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const del = await mongoManager.deleteProduct(req.params)
        res.status(200).send({
            status: 'success',
            payload: del
        })
    } catch (error) {
        if (error) return res.status(500).send({ status: 'error', payload: error })
    }
})

module.exports = router