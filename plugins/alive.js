import os from 'os';
import moment from 'moment';
import { execSync } from 'child_process';

const lang = 'ar';

const messages = {
    en: {
        botStatus: "*📊 Bot Status:*",
        uptimeBot: "- *Bot Uptime:*",
        memoryUsage: "- *Memory Usage:*",
        serverUptime: "- *Server Uptime:*",
        osInfo: "*🚀 Operating System:*",
        osType: "- *OS:*",
        osArch: "- *Arch:*",
        unavailable: "Unavailable",
        error: "An error occurred while fetching the bot status:"
    },
    ar: {
        botStatus: "*📊 حالة البوت:*",
        uptimeBot: "- *وقت تشغيل البوت:*",
        memoryUsage: "- *استخدام الذاكرة:*",
        serverUptime: "- *وقت تشغيل الخادم:*",
        osInfo: "*🚀 نظام التشغيل:*",
        osType: "- *النظام:*",
        osArch: "- *النواة:*",
        unavailable: "غير متاح",
        error: "حدث خطأ أثناء عرض حالة البوت:"
    }
};

const handler = async (m, { conn }) => {
    try {
        const uptime = process.uptime();
        const uptimeString = moment.duration(uptime, 'seconds').humanize();
        const botMemoryUsage = process.memoryUsage().rss / 1024 / 1024;

        let serverUptime;
        try {
            serverUptime = execSync('uptime -p').toString().trim();
        } catch (error) {
            serverUptime = messages[lang].unavailable;
        }

        const message = `
${messages[lang].botStatus}
${messages[lang].uptimeBot} ${uptimeString}
${messages[lang].memoryUsage} ${botMemoryUsage.toFixed(2)} MB
${messages[lang].serverUptime} ${serverUptime}

${messages[lang].osInfo}
${messages[lang].osType} ${os.type()} ${os.release()}
${messages[lang].osArch} ${os.arch()}
        `;

        await conn.sendMessage(m.chat, { text: message.trim() });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(m.chat, { text: `${messages[lang].error} ${error.message}` });
    }
};

handler.command = /^(alive|status|uptime)$/i;
handler.tags = ['info'];

export default handler;
                                        
