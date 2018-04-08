import Mock from 'mockjs'

let data = Mock.mock({
    'data|3-10':[1]
})
data = data.data.map(el => {
    el = Mock.mock({
        "title": Mock.Random.ctitle(5,15),
        "url": Mock.Random.url()
    })
    return el
})

export {data}