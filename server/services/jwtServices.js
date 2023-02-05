import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from '../config';

class JwtService {

    static sign(payload, expiry='60s', secret = JWT_ACCESS_SECRET){
          return jwt.sign(payload, secret, {expiresIn: expiry})
    }

    static verify(token, secret = JWT_ACCESS_SECRET){
        return jwt.verify(token, secret);
    }
    
}

export default JwtService;