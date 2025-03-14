var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function encode(blocks) {
  var base64 = '';

  var zeroCount = (6 - (blocks.length % 6)) % 6;
  var paddingCount = (24 - ((blocks.length + zeroCount) % 24)) / 6;

  for (var i = 0; i < zeroCount; i++) {
    blocks.push(0);
  }

  for (var i = 0; i < blocks.length; i += 6) {
    var value = 0;
    for (var x = 0; x < 6; x++) {
      value += blocks[i + x] > 0 ? Math.pow(2, 5 - x) : 0;
    }
    base64 += base64chars[value];
  }

  for (var i = 0; i < paddingCount; i++) {
    base64 += '=';
  }
  return base64;
}

function decode(base64) {
  var blocks = [];

  base64 = base64.replace(/=/g, '');

  for (var i = 0; i < base64.length; i++) {
    var index = base64chars.indexOf(base64[i]);
    var binaryString = '000000' + index.toString(2);
    binaryString = binaryString.substring(binaryString.length - 6);
    for (var c_id = 0; c_id < binaryString.length; c_id++) {
      blocks.push(binaryString[c_id] == '0' ? 0 : 1);
    }
  }

  return blocks;
}

export const base64 = {
  encode: encode,
  decode: decode
}