import jwt from 'jsonwebtoken';

// Generate JWT token and set it as an HTTP-only cookie. dont confuse the below line with req/response. res is assigned to the cookie in the controller where this function is called.
const generateJWTTokenAndSetCookie = (userId, res) => {
   const token = jwt.sign({userId}, process.env.JWT_SECRET, {
       expiresIn: "15d"
   })
   res.cookie("jwt", token, {
       maxAge: 15*24*60*60*1000, //miliseconds
       httpOnly: true,
       sameSite:"strict",
       secure: false
   })
}

export default generateJWTTokenAndSetCookie