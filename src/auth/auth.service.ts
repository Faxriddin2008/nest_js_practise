import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import { PrismaClient } from "@prisma/client";
import { ForbiddenException } from "@nestjs/common/exceptions";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/binary';

import * as argon from 'argon2'
@Injectable({})
export class AuthService {
    constructor(private prisma: PrismaService){}
    async signup(dto: AuthDto){
        const {email, password} = dto;
        const hash = await argon.hash(password);
        try{
            const user = await this.prisma.user.create({
                data: {
                    email,
                    hash
                }
            })
            delete user.hash
            return user
        }catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code === 'P2002'){
                    throw new ForbiddenException("Credentials taken");
                }
            }
            throw error
        }
    }
    async signin(dto: AuthDto){
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        if(!user) throw new ForbiddenException("Credentials incorrect")
        const pwMatches = await argon.verify(user.hash, dto.password)
        if(!pwMatches) throw new ForbiddenException("Credentials incorrect")
        delete user.hash
        return "I am signed in"
    }

}