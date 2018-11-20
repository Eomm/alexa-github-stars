const haveToLog = process.env.PRINT_LOG === 'true';

module.exports = function log() {
  if (haveToLog) {
    console.log(arguments);
  }
}

