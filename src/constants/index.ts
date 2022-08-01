import { OPEN_IN_WEB, STORAGE } from "../theme/constants";
import { ethers } from "ethers";
import millify from "millify";
export const setStorageSyncValue = async (keyName: string, value: any) => {
  try {
    if (OPEN_IN_WEB) {
      return new Promise<void>((resolve, reject) => {
        localStorage.setItem(keyName, JSON.stringify(value));
        resolve();
      });
    }

    return new Promise<void>((resolve, reject) => {
      STORAGE?.set({ [keyName]: JSON.stringify(value) }, function () {
        resolve();
      });
    });
  } catch (error) {
    console.log("error setting the sync storage ", error);
  }
};
export const removeStorageSyncValue = async (keyName: string) => {
  try {
    if (OPEN_IN_WEB) {
      return new Promise<void>((resolve, reject) => {
        localStorage.removeItem(keyName);
        resolve();
      });
    }

    return new Promise<void>((resolve, reject) => {
      STORAGE?.remove(keyName, function () {
        resolve();
      });
    });
  } catch (error) {
    console.log("error setting the sync storage ", error);
  }
};

export const conciseAddress = (address: string) => {
  return `${address.slice(0, 4)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
};
export const getStorageSyncValue = async (keyName: string) => {
  try {
    if (OPEN_IN_WEB) {
      return new Promise((resolve, reject) => {
        const item = localStorage.getItem(keyName);
        if (item) resolve(JSON.parse(item));
        else resolve({});
      });
    }
    return new Promise((resolve, reject) => {
      STORAGE?.get([keyName], function (extractedValue) {
        if (extractedValue[keyName])
          resolve(JSON.parse(extractedValue[keyName]));
        else resolve({});
      });
    });
  } catch (error) {
    console.log("error getting the sync storage ", error);
  }
};
export const decrypt = async (data: string, hashedPassword: string) => {
  try {
    let decryptData = await ethers.Wallet.fromEncryptedJson(
      data,
      hashedPassword
    );
    return decryptData;
  } catch (error) {
    console.log(error);
  }
};
export const numFormatter = (number: number, precision?: number) => {
  if (number > Math.pow(2, 53)) number = 0;
  let symbol = "",
    status = true;
  if (number.toString().includes("e-")) {
    status = false;
  }
  let amount = millify(number, {
    precision: precision || 2,
  });

  if (amount.includes("K")) symbol = "K";
  if (amount.includes("M")) symbol = "M";
  if (amount.includes("B")) symbol = "B";
  if (amount.includes("T")) symbol = "T";
  if (amount.includes("P")) symbol = "P";
  if (amount.includes("E")) symbol = "E";

  if (amount.includes("-")) {
    amount = amount.replace("-", "");
    status = false;
  }

  return { amount: parseFloat(amount.replace(symbol, "")), symbol, status };
};
export const generateNotification = async (
  title: string,
  message: string,
  link?: string
) => {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      const notification = new Notification(title, {
        body: message,
      });
      if (link) {
        notification.onclick = function () {
          window.open(link);
        };
      }
    }
  });
};
