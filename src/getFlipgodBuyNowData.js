const axios = require('axios')
const { fulfillBasicOrder_efficient_6GL6yc_abi } = require('./os/getFullfillAnListingAbi.js')
const { opensea_x_api_key, ethereum_provider_url } = require('./config/os-config.js')
const flipgodBuyNowAbi = require('./flipgodBuyNow-abi.json')
const Web3 = require('web3')
const web3 = new Web3(ethereum_provider_url)

/**
 * 
 * @param {*} market option: OpenSea、Blur
 * @param {*} recipient 
 * @param {*} nftContract 
 * @param {*} tokenId 
 */
async function getFlipgodBuyNowAbi(market, recipient, nftContract, tokenId) {
    if ('OpenSea' === market) {
        // nftContract => collectionSlug
        const options = {
            method: 'GET',
            url: `https://api.opensea.io/api/v2/chain/ethereum/contract/${nftContract}`,
            headers: { accept: 'application/json', 'X-API-KEY': opensea_x_api_key }
        }
        const response = await axios(options)
        const collectionSlug = response.data.collection

        const marketCallData = await fulfillBasicOrder_efficient_6GL6yc_abi(collectionSlug, tokenId, recipient)

        // TODO update this CA
        const flipgodBuyNowContractAddress = '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC'
        const buyNowEncoded = web3.eth.abi.encodeFunctionCall({
            name: 'buyNow',
            type: 'function',
            inputs: [{
                type: 'address',
                name: 'marketContract'
            },{
                type: 'bytes',
                name: 'marketCallData'
            }]
        }, [flipgodBuyNowContractAddress, marketCallData]);
        console.log('buyNowEncoded: ', buyNowEncoded)
        return buyNowEncoded
    }
}

!(async function () {
    /**
     * boredapeyachtclub
     * 0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d
     * 9044
     * 
     * otherdeed-expanded
     * 0x790b2cf29ed4f310bf7641f013c65d4560d28371
     * 54452
     */
    const market = 'OpenSea';
    const recipient = '0xf011F97d87Ba4ac949C940a84B12E276E13f0529';
    const nftContract = '0x790b2cf29ed4f310bf7641f013c65d4560d28371';
    const tokenId = 54452;
    const encoded = await getFlipgodBuyNowAbi(market, recipient, nftContract, tokenId)
})()