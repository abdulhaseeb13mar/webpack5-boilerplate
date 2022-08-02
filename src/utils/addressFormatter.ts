export const formatAddress = (address: string) =>
  `${address.slice(0, 2)}...${address.slice(address.length - 5)}`;
