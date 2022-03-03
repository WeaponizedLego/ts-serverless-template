import moment from 'moment'

console.log(new Date())

const m = new Date(new Date().setHours(new Date().getHours() - 10))
const n = new Date(new Date().setDate(new Date().getDate() - 13))

console.log(m)
console.log(n)
