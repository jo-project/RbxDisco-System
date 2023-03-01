import { default as AdminModel } from '../models/data/admin.js';
import { AdminModelInterface } from '../models/interfaces/admin.interface.js';;

export class AdminProvider {
    public data: AdminModelInterface & Required<{ _id: string; }> | undefined;
    public id: string;
    constructor(guildId: string) {
        this.id = guildId;
    }
    
    async _initialize() {
        this.data = await AdminModel.findById(this.id) || new AdminModel({
            _id: this.id
        })
    }

    async getData() {
        await this._initialize()
        return this.data
    }

    async view() {
        if (this.data !== undefined) {
            const level_2 = this.data.level_2;
            const level_3 = this.data.level_3;
            const level_4 = this.data.level_4;
            const level_5 = this.data.level_5;
            const level_6 = this.data.level_6;

            const field_2 = {
                name: 'Admin Level 2',
                value: level_2.length > 0 ? level_2.map(value => {
                    return `**${value.type}**: ${value.type === 'Role' ? `<@&${value.id}>` : `<@${value.id}>`}`
                }).join('\n') : '\u200b'
            }

            const field_3 = {
                name: 'Admin Level 3',
                value: level_3.length > 0 ? level_3.map(value => {
                    return `**${value.type}**: ${value.type === 'Role' ? `<@&${value.id}>` : `<@${value.id}>`}`
                }).join('\n') : '\u200b'
            }

            const field_4 = {
                name: 'Admin Level 4',
                value: level_4.length > 0 ? level_4.map(value => {
                    return `**${value.type}**: ${value.type === 'Role' ? `<@&${value.id}>` : `<@${value.id}>`}`
                }).join('\n') : '\u200b'
            }

            const field_5 = {
                name: 'Admin Level 5',
                value: level_5.length > 0 ? level_5.map(value => {
                    return `**${value.type}**: ${value.type === 'Role' ? `<@&${value.id}>` : `<@${value.id}>`}`
                }).join('\n') : '\u200b'
            }

            const field_6 = {
                name: 'Admin Level 6',
                value: level_6.length > 0 ? level_6.map(value => {
                    return `**${value.type}**: ${value.type === 'Role' ? `<@&${value.id}>` : `<@${value.id}>`}`
                }).join('\n') : '\u200b'
            }



            return {
                field_2 : field_2,
                field_3 : field_3,
                field_4 : field_4,
                field_5 : field_5,
                field_6 : field_6
            }
        }
    }

    async check(id: string, level: number) {
        if (this.data !== undefined) {
            const level_2 = this.data.level_2;
            const level_3 = this.data.level_3;
            const level_4 = this.data.level_4;
            const level_5 = this.data.level_5;
            const level_6 = this.data.level_6;

            const isLevel2 = level_2.find(data => data.id === id)
            const isLevel3 = level_3.find(data => data.id === id)
            const isLevel4 = level_4.find(data => data.id === id)
            const isLevel5 = level_5.find(data => data.id === id)
            const isLevel6 = level_6.find(data => data.id === id)

            var userLevel: number = 0;
            if (isLevel2) {
                userLevel = 2
            } else if (isLevel3) {
                userLevel = 3
            } else if (isLevel4) {
                userLevel = 4
            } else if (isLevel5) {
                userLevel = 5
            } else if (isLevel6) {
                userLevel = 6
            }

            if (userLevel >= level) {
                return {
                    status: 200,
                }
            } else {
                return {
                    status: 404,
                }
            }
        }
    }

    async add(id: string, type: string, level: number) {
        if (this.data !== undefined) {
            const level_2 = this.data.level_2;
            const level_3 = this.data.level_3;
            const level_4 = this.data.level_4;
            const level_5 = this.data.level_5;
            const level_6 = this.data.level_6;

            const isLevel2 = level_2.some(data => data.id === id)
            const isLevel3 = level_3.some(data => data.id === id)
            const isLevel4 = level_4.some(data => data.id === id)
            const isLevel5 = level_5.some(data => data.id === id)
            const isLevel6 = level_6.some(data => data.id === id)

            if (!isLevel2 && !isLevel3 && !isLevel4 && !isLevel5 && !isLevel6) {
                if (level === 2) {
                    level_2.push({
                        id: id,
                        type: type
                    })
                } else if (level === 3) {
                    level_3.push({
                        id: id,
                        type: type
                    })
                } else if (level === 4) {
                    level_4.push({
                        id: id,
                        type: type
                    })
                } else if (level === 5) {
                    level_5.push({
                        id: id,
                        type: type
                    })
                } else if (level === 6) {
                    level_6.push({
                        id: id,
                        type: type
                    })
                } else {
                    return {
                        status: 404,
                        response: {
                            error: 'Failed to add data'
                        }
                    }
                }

                this.data.save()
                return {
                    status: 200,
                    response: {
                        success: `${type} ${type === 'Role' ? `<@&${id}>` : `<@${id}>`} is successfully added to Admin Level ${level}`
                    }
                }
            } else {
                var type: string = ''
                var dataLevel: string = ''
                if (isLevel2) {
                    const userData = level_2.find(data => data.id === id)
                    if (userData) {
                        type = userData.type
                        dataLevel = 'level 2'
                    }
                } else if (isLevel3) {
                    const userData = level_3.find(data => data.id === id)
                    if (userData) {
                        type = userData.type
                        dataLevel = 'level 3'
                    }
                } else if (isLevel4) {
                    const userData = level_4.find(data => data.id === id)
                    if (userData) {
                        type = userData.type
                        dataLevel = 'level 4'
                    }
                } else if (isLevel5) {
                    const userData = level_5.find(data => data.id === id)
                    if (userData) {
                        type = userData.type
                        dataLevel = 'level 5'
                    }
                } else if (isLevel6) {
                    const userData = level_6.find(data => data.id === id)
                    if (userData) {
                        type = userData.type
                        dataLevel = 'level 6'
                    }
                }

                return {
                    status: 503,
                    response: {
                        error: `${type === 'Role' ? `<@&${id}>` : `<@${id}>`} is already an admin on ${dataLevel}`
                    }
                }
            }
        }
    }
}