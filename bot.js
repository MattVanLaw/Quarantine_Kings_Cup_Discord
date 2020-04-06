const Discord = require('discord.io');
const logger = require('winston');

const auth = require('./auth.json');
const gameListeners = require('./gameListeners');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true,
});

logger.level = 'debug';

// Initialize Discord Bot
const bot = new Discord.Client({
  token: auth.token,
  autorun: true,
});

bot.on('ready', function(evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', (user, userId, channelId, message, event) => {
  if (message.includes('OTL')) {
    bot.sendMessage({
      to: channelId,
      message: `Cheer up, ${user}! How about some King's Cup to brighten your day? Just type \`!startKings\``,
    });
  }
});

gameListeners(bot, logger);
