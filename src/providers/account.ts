import { Guild, GuildMember } from 'discord.js';
import { default as AccountSchema } from '../models/data/account.js'
import { AccountModelInterface } from '../models/interfaces/account.interface.js';
import type { GenerateOptions } from '../types/password.type.js';
import { generate, checkPasswordStrength } from '../extensions/password.js';

const lowercase = 'abcdefghijklmnopqrstuvwxyz'
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const numbers = '0123456789'
const symbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~'
const similarCharacters = /[ilLI|`oO0]/g

type dataSend = {
    username: string,
    password: string,
    is_login: boolean,
    password_strength: string
}

export class AccountProvider {
    private readonly user: GuildMember;
    private data: AccountModelInterface & Required<{ _id: string; }> | undefined;
    constructor(member: GuildMember) {
        this.user = member;
    }

    async _initialize() {
        const data = await AccountSchema.findById(this.user.id) || await this.create()
        if (data) {
            this.data = data
        }
    }

    async setUsername(username: string) {
        const userData = await AccountSchema.findById(this.user.id)
        if (userData) {
            if (!userData.username) {
                userData.username = username
                userData.save();
                this.data = userData
            }
        }
    }

    async setPassword(password: string) {
        const userData = await AccountSchema.findById(this.user.id)
        if (userData) {
            if (!userData.password) {
                userData.password = password
                userData.save()
                this.data = userData
            }
        }
    }

    async create() {
        const data = new AccountSchema({
            _id: this.user.id
        })

        data.save();
        return data
    }

    async register(username: string, password: string) {
        const userData = await AccountSchema.findById(this.user.id) || await this.create()
        if (userData) {
            if (!userData.password && !userData.username) {
                await this.setUsername(username)
                await this.setPassword(password)
                return {
                    status: 200,
                    response: {
                        username: username,
                        password: password
                    }
                }
            } else {
                return {
                    status: 200,
                    response: {
                        error: 'You already have an account'
                    }
                }
            }
        } else {
            return {
                status: 200,
                response: {
                    error: `You haven't do create() term`
                }
            }
        }
    }

    async login(username: string, password: string) {
        const userData = await AccountSchema.findById(this.user.id)
        if (userData) {
            if (userData.username !== username)  return {
                status: 404,
                response: `Incorrect username.`
            }
            if (userData.password !== password) return {
                status: 404,
                response: `Incorrect password.`
            }

            userData.is_login = true
            userData.save()
            return {
                status: 200,
                response: 'You have successfully logged into your account'
            }

        } else {
            return {
                status: 404,
                response: `You don't have any account`
            }
        }
    }

    async check() {
        const data = await AccountSchema.findById(this.user.id)
        var dataSend: dataSend | undefined;
        if (data) {
            this.data = data
            const username = this.data.username;
            const password = this.data.password;
            const is_login = this.data.is_login;
            const password_strength = await this.checkPasswordStrength(password)
            dataSend = {
                username: username,
                password: password,
                is_login: is_login,
                password_strength: password_strength.value
            }
        }

        return {
            status: 200,
            response: dataSend
        }
    }

    async generateRandomPassword(options?: GenerateOptions) : Promise<string> {
        const passwordOpt = options || {};

        if (!Object.prototype.hasOwnProperty.call(passwordOpt, 'length')) passwordOpt.length = 10;
        if (!Object.prototype.hasOwnProperty.call(passwordOpt, 'numbers')) passwordOpt.numbers = false;
        if (!Object.prototype.hasOwnProperty.call(passwordOpt, 'symbols')) passwordOpt.symbols = false;
        if (!Object.prototype.hasOwnProperty.call(passwordOpt, 'exclude')) passwordOpt.exclude = '';
        if (!Object.prototype.hasOwnProperty.call(passwordOpt, 'uppercase')) passwordOpt.uppercase = true;
        if (!Object.prototype.hasOwnProperty.call(passwordOpt, 'lowercase')) passwordOpt.lowercase = true;
        if (!Object.prototype.hasOwnProperty.call(passwordOpt, 'excludeSimilarCharacters')) passwordOpt.excludeSimilarCharacters = false;
        if (!Object.prototype.hasOwnProperty.call(passwordOpt, 'strict')) passwordOpt.strict = false;

        if (passwordOpt.strict) {
            var minStrictLength = 1 + (passwordOpt.numbers ? 1 : 0) + (passwordOpt.symbols ? 1 : 0) + (passwordOpt.uppercase ? 1 : 0);
            if (minStrictLength > passwordOpt.length!) {
                throw new TypeError('Length must correlate with strict guidelines');
            }
        }

        // Generate character pool
        var pool = '';

        // lowercase
        if (passwordOpt.lowercase) {
            pool += lowercase;
        }

        // uppercase
        if (passwordOpt.uppercase) {
            pool += uppercase;
        }
        // numbers
        if (passwordOpt.numbers) {
            pool += numbers;
        }
        // symbols
        if (passwordOpt.symbols) {
            if (typeof passwordOpt.symbols === 'string') {
                pool += passwordOpt.symbols;
            } else {
                pool += symbols;
            }
        }

        // Throw error if pool is empty.
        if (!pool) {
            throw new TypeError('At least one rule for pools must be true');
        }

        // similar characters
        if (passwordOpt.excludeSimilarCharacters) {
            pool = pool.replace(similarCharacters, '');
        }

        // excludes characters from the pool
        var i = passwordOpt.exclude!.length;
        while (i--) {
            pool = pool.replace(passwordOpt.exclude![i], '');
        }

        var password = await generate(passwordOpt, pool);

        return password;
    }

    async checkPasswordStrength(password: string) {
        const passwordAvailable = await checkPasswordStrength(password)
        return passwordAvailable
    }

    async checkPassword(password: string) : Promise<boolean> {
        const upperReg = /[A-Z]/;
        const lowerReg = /[a-z]/;
        const specialReg = /[!@#$%^&*()+_\-=}{[\]|:;"/?.><,`~]/ ;
        return upperReg.test(password) && lowerReg.test(password) && specialReg.test(password);
    }
}