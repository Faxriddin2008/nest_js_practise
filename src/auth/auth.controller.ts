import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Get, Post } from "@nestjs/common/decorators";
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @Post('signup')
    signup(){
        return "Sign up"
    }
    @Post('signin')
    signin(){
        return "Sign in"
    }
    
}