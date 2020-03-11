const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message =>{
    if(message.author.bot) return;
    console.log(message.content);
    if (message.content==='hello'){
        message.channel.send("Hello there");
    } else{
        message.channel.send("Say Hello you noob");
    }
});

client.login('Njg2MzAwNjI5MTMxMzI5NjA2.XmcUHw.jaV6KuyILgfXeHgF82uvoKZQ_ks');