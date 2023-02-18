import token from 'jsonwebtoken';


// const tokenName = 'abc'
const tokenGenerate = (id) => {
    return token.sign({id},process.env.JWT_SECRET_KEY, {
        expiresIn:"30d"
    })
}

export default tokenGenerate