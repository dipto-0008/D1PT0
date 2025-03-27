const axios = require("axios");
const baseApiUrl = async () => {
    const base = await axios.get(
        `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`,
    );
    return base.data.api;
};
const { createReadStream, unlinkSync, writeFileSync } = require("fs-extra");

async function getAvatarUrls(userIDs) {
    let avatarURLs = [];
    for (let userID of userIDs) {
            try {
            const shortUrl = `https://graph.facebook.com/${userID}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            const d = await axios.get(shortUrl);
            let url = d.request.res.responseUrl;
            avatarURLs.push(url);
    } catch (error) {
         avatarURLs.push("https://i.ibb.co/qk0bnY8/363492156-824459359287620-3125820102191295474-n-png-nc-cat-1-ccb-1-7-nc-sid-5f2048-nc-eui2-Ae-HIhi-I.png");
    }
}
    return avatarURLs;
}
module.exports = {
    config: {
        name: "gcimg",
        version: "1.0",
        credits: "Dipto",
        cooldowns: 5,
        hasPermission: 0,
        description: "𝗚𝗲𝘁 𝗚𝗿𝗼𝘂𝗽 𝗜𝗺𝗮𝗴𝗲",
        usePrefix: true,
        prefix: true,
        commandCategory: "𝗜𝗠𝗔𝗚𝗘",
        category: " image",
        usages: "{pn} --color [color] --bgcolor [color] --admincolor [color] --membercolor [color]",
    },

    run: async function ({ api, args, event }) {
        try {
            let color = "white"; //text color
            let bgColor = "https://i.ibb.co/0cKs9kf/1000009359.jpg";
            let adminColor = "yellow";
            let memberColor = "#00FFFF";
            let groupborderColor = "lime";
            let glow = false;
            for (let i = 0; i < args.length; i++) {
                switch (args[i]) {
                    case "--color":
                        color = args[i + 1];
                        args.splice(i,2);
                        break;
                    case "--bgcolor":
                        bgColor = args[i + 1];
                        args.splice(i,2);
                        break;
                    case "--admincolor":
                        adminColor = args[i + 1];
                        args.splice(i,2);
                        break;
                    case "--membercolor":
                        memberColor = args[i + 1];
                        args.splice(i,2);
                        break;
                         case "--groupBorder":
                    groupborderColor = args[i + 1];
                    args.splice(i,2);
                        break;
                        case "--glow":
                    glow = args[i + 1];
                    args.splice(i,2);
                        break;
                }
            }
            let threadInfo = await api.getThreadInfo(event.threadID);
            let participantIDs = threadInfo.participantIDs;
            let adminIDs = threadInfo.adminIDs.map((admin) => admin.id);
            let memberURLs = await getAvatarUrls(participantIDs);
            let adminURLs = await getAvatarUrls(adminIDs);

            const data2 = {
                memberURLs: memberURLs,
                groupPhotoURL: threadInfo.imageSrc,
                adminURLs: adminURLs,
                groupName: threadInfo.threadName,
                bgcolor: encodeURI(bgColor),
                admincolor: encodeURI(adminColor),
                membercolor: encodeURI(memberColor),
                color: encodeURI(color),
                groupborderColor,
                glow
            };

            if (data2) {
                var waitingMsg = await api.sendMessage(
                    "⏳ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 𝚊 𝚠𝚑𝚒𝚕𝚎.",
                    event.threadID,
                );
                api.setMessageReaction(
                    "⏳",
                    event.messageID,
                    (err) => {},
                    true,
                );
            }
            const { data } = await axios.post(
                `${await baseApiUrl()}/gcimg`,
                data2,
                { responseType: "stream" }
            );
            // writeFileSync(path, Buffer.from(imgData, 'binary'));
    
                api.setMessageReaction(
                    "✅",
                    event.messageID,
                    (err) => {},
                    true,
                );
                api.unsendMessage(waitingMsg.messageID);
                api.sendMessage({ body: `𝙷𝚎𝚛𝚎 𝚒𝚜 𝚢𝚘𝚞𝚛 𝚐𝚛𝚘𝚞𝚙 𝚒𝚖𝚊𝚐𝚎 <😘`,
                        attachment: data },
                    event.threadID,
                    event.messageID );
            
        } catch (error) {
            console.log(error);
            api.sendMessage(`❌ | 𝙴𝚛𝚛𝚘𝚛: ${error.message}`);
        }
    },
};
