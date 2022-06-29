const user = process.env.USER_MOGODB
const pass = process.env.PASSWORD_MOGODB
if(process.env.NODE_ENV == "production"){
module.exports = { mongoURI: `mongodb+srv://${user}:${pass}@apicluster.geygt.mongodb.net/?retryWrites=true&w=majority`}
}else{
    module.exports = { mongoURI: `mongodb://localhost/blogapp`}
}