import jwt from "jsonwebtoken" ;

export const generateTokenAndSetCookie = (userId, res) => { //Takes userId as req , we're gonna set a cookie and send it back to client...
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn : '15d' //cookie will expire in 15days...
    }) ;

    res.cookie("jwt",token,{
        maxAge : 15*24*60*60*1000, //maxAge in milliseconds...
        httpOnly : true ,
        sameSite : "strict" , 
        secure : process.env.NODE_ENV !== "development",
    });
}

//Generating a JSON Web Token (JWT) and setting it as a cookie in the client’s browser....
//This token is used for authentication and session management


//jwt.sign(payload, secret, options):

// payload: The data to be encoded in the token (e.g., { userId }).
// secret: A secret key used to sign the token (stored in .env as JWT_SECRET).
// options: Additional settings (e.g., expiresIn to set the token’s expiration time).


// res.cookie(name, value, options):

// name: The name of the cookie ("jwt" in this case).
// value: The value of the cookie (the generated JWT).
// options: Additional settings for the cookie:

// maxAge: The lifespan of the cookie in milliseconds (15 * 24 * 60 * 60 * 1000 = 15 days).
// httpOnly: Prevents client-side JavaScript from accessing the cookie (enhances security).
// sameSite: Prevents the cookie from being sent in cross-site requests (protects against CSRF attacks).
// secure: Ensures the cookie is only sent over HTTPS. In development (NODE_ENV = development), this is set to false to allow cookies over HTTP.