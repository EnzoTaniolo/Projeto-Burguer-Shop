const express = require("express")
const uuid = require("uuid")

const port = 3000

const app = express()
app.use(express.json())

const orders = []

const checkHeaders = (request, response, next) => {
    console.log(request.method)
    console.log(request.url)

    next()
}

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "Order not found" })

    }

    const orderStatus = orders[index].status

    request.body.orderId = id
    request.body.orderIndex = index
    request.body.orderStatus = orderStatus

    next()

}

app.get("/orders", checkHeaders, (request, response) => {
    return response.json(orders)
})

app.post("/orders", checkHeaders, (request, response) => {
    const { clientorder, clientname, price } = request.body

    const order = { id: uuid.v4(), clientorder, clientname, price, status: "em preparação" }

    orders.push(order)

    return response.status(201).json(order)
})

app.put("/orders/:id", checkHeaders, checkUserId, (request, response) => {
    const index = request.body.orderIndex
    const oldOrder = orders[index]
    const updatedOrderData = request.body

    const updatedOrder = {
        orderId: updatedOrderData.orderId || oldOrder.orderId,
        clientorder: updatedOrderData.clientorder || oldOrder.clientorder,
        clientname: updatedOrderData.clientname || oldOrder.clientname,
        price: updatedOrderData.price || oldOrder.price,
        orderStatus: updatedOrderData.orderStatus || oldOrder.orderStatus

    };

    orders[index] = updatedOrder

    return response.status(200).json(orders[index])

})

app.delete("/orders/:id", checkHeaders, checkUserId, (request, response) => {
    const index = request.body.orderIndex

    orders.splice(index, 1)

    return response.status(204).json(

    )
})

app.get("/orders/:id", checkHeaders, checkUserId, (request, response) => {
    const index = request.body.orderIndex

    return response.json(orders[index])

})

app.patch("/orders/:id", checkHeaders, checkUserId, (request, response) => {
    const index = request.body.orderIndex
    const oldOrder = orders[index]
    const updatedOrderData = request.body

    const updatedOrder = {
        orderId: oldOrder.orderId,
        clientorder: oldOrder.clientorder,
        clientname: oldOrder.clientname,
        price: oldOrder.price,
        orderStatus: "Pronto"
    }

    orders[index] = updatedOrder

    return response.status(200).json(updatedOrder)


})

app.listen(port, () => {
    console.log(`Server Started on port ${port}👍`)
})