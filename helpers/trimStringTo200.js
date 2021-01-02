const trimStringTo200 = (string) => {
  const maxLength = 200;
  return string.length > maxLength ? string.substring(0, maxLength - 3) + '...' : string.substring(0, maxLength);
};

module.exports = trimStringTo200;
