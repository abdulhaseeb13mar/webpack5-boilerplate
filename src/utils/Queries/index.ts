export const endpoint = "https://graphql.bitquery.io/";

export const getUSDPrice = `
query ($baseCurrency: String,$quoteCurrency:String,$network:EthereumNetwork)
{
  ethereum(network: $network) {
    dexTrades(
      options: {desc: ["block.height","tradeIndex"], limit: 2}
      baseCurrency: {is: $baseCurrency}
      quoteCurrency: {is: $quoteCurrency}
    ) {
      transaction {
        hash
      }
      tradeIndex
      smartContract {
        address {
          address
        }
        contractType
        currency {
          name
        }
      }
      tradeIndex
      block {
        height
      }
      baseCurrency {
        symbol
        address
      }
      quoteCurrency {
        symbol
        address
      }
      quotePrice
    }
  }
}
`;
