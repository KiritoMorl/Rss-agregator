export default (url) => {
  const domParser = new DOMParser();
  const parser = domParser.parseFromString(url, 'text/xml');
  return parser;
};
