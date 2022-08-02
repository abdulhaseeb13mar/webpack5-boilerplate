import { KeyPair } from "near-api-js";

const { generateSeedPhrase } = require("near-seed-phrase");

export const ConvertMnemonicToArray = (str: string) => {
  const words = str.split(" ");
  for (let i = 0; i < words.length - 1; i++) {
    words[i] += " ";
  }
  return words;
};

export const generateSeed = () => {
  const { seedPhrase, secretKey } = generateSeedPhrase();
  const recoveryKeyPair = KeyPair.fromString(secretKey);
  // @ts-ignore
  console.log(recoveryKeyPair);
  return {
    phrase: seedPhrase,
    address: recoveryKeyPair.getPublicKey().toString(),
    // @ts-ignore
    secret: recoveryKeyPair.secretKey,
  };
};
