const Discord = require('discord.js');
const client = new Discord.Client();

const token = 0;

client.login(token);

client.on('ready', readyDiscord);

function readyDiscord() {
    console.log("Logged in");
}


client.on('message', message => {
    let upCount = -1;
    let downCount = 0;
    let userList = [];


    if (message.content.startsWith('!') && message.content.endsWith('>')) {
        console.log(message.content);

        const user = message.mentions.users.first();
        const member = message.guild.members.resolve(user);

        let arguements = message.content.split(" ");

        if (arguements[0] === "!kick") {

            message.channel.send('Do you want to kick ' + arguements[1]).then((question) => {
                // Have our bot guide the user by reacting with the correct reactions
                question.react('👍');
                question.react('👎');

                const filter = (reaction) => {
                    return reaction.emoji.name;
                };

                const collector = question.createReactionCollector(filter, { time: 15000 });

                collector.on('collect', (reaction, user) => {

                    if (reaction.emoji.name === '👍' && !userList.includes(user.id)) {
                        upCount += 1;
                        userList.push(user.id);
                        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
                    }
                    else if (reaction.emoji.name === '👎' && !userList.includes(user.id)) {
                        downCount += 1;
                        userList.push(user.id);
                        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
                    }
                });
                
                collector.on('end', collected => {
                    if (upCount >= downCount + 1 && upCount + downCount > 1) {
                        message.channel.send('Up Count won with ' + String(upCount) + ' votes ' + arguements[1] + " will now be kicked");
                        member.voice.kick();
                    }
                    else {
                        message.channel.send('Down Count won with ' + String(downCount) + ' votes ' + arguements[1] + " will not be kicked");
                    }     
                });

            });

        }
    }
});




