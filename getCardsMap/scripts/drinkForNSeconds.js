module.exports = (time) => {
  let i = 0;

  return (bot, channelId) => {
    const interval = setInterval(() => {
      i += 1;

      bot.sendMessage({
        to: channelId,
        message: `Waterfall! ${ i }`,
      });

      if (i === time) {
        i = 0;
        clearInterval(interval);
      }
    }, 1000);
  };
};
