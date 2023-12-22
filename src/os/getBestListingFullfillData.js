const axios = require('axios')
const { opensea_x_api_key, ethereum_provider_url } = require('../config/os-config.js')
const seaport_contract_address = '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC' // seaport1.5 contract address

const Web3 = require('web3')
const web3 = new Web3(ethereum_provider_url)

/**
 * Get Best Listing (by NFT)
 * @param {*} collectionSlug 
 * @param {*} tokenId 
 * @returns 
 */
async function getBestListingByNFT(collectionSlug, tokenId) {
    try {
        const options = {
            method: 'GET',
            url: `https://api.opensea.io/api/v2/listings/collection/${collectionSlug}/nfts/${tokenId}/best`,
            headers: { accept: 'application/json', 'X-API-KEY': opensea_x_api_key }
        }

        const response = await axios(options)
        const data = response.data
        console.log('responseData: ', JSON.stringify(data))

        // TODO 可能需要，处理一下请求速率过快的问题

        const orderHash = data.order_hash
        console.log('orderHash: ', orderHash)
        return orderHash
    } catch (error) {
        console.log(JSON.stringify(error))
    }
}

/**
 * construct request data
 * @param {*} collectionSlug 
 * @param {*} tokenId 
 * @param {*} buyerAddress 
 * @returns 
 */
async function getFulfillAnListingParams(collectionSlug, tokenId, buyerAddress) {
    let orderHash = await getBestListingByNFT(collectionSlug, tokenId)

    const requestData = {
        listing: {
            hash: orderHash,
            chain: 'ethereum',
            protocol_address: seaport_contract_address
        },
        fulfiller: {
            address: buyerAddress
        }
    }

    const params = await getFulfillAnListing(requestData)
    return params
}

/**
 * Fulfill Listing
 * @param {*} requestData 
 * @returns
 */
async function getFulfillAnListing(requestData) {
    try {
        const options = {
            method: 'POST',
            url: 'https://api.opensea.io/api/v2/listings/fulfillment_data',
            headers: { 'content-type': 'application/json', 'X-API-KEY': opensea_x_api_key },
            data: requestData
        }
        console.log('requestData: ', JSON.stringify(requestData))

        const response = await axios(options)
        const data = response.data
        console.log('responseData: ', JSON.stringify(data))

        return data
    } catch (error) {
        console.log(JSON.stringify(error))
    }
}

/**
 * 测试代码，勿删，不用时注释掉
 */
// !(async function () {
//     /**
//      * otherdeed-expanded
//      * 0x790b2cf29ed4f310bf7641f013c65d4560d28371
//      * 65687
//      */
//     /**
//      * boredapeyachtclub
//      * 0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d
//      * 9044
//      */
//     const collectionSlug = 'boredapeyachtclub'
//     const tokenId = 9908
//     const buyerAddress = '0xf011F97d87Ba4ac949C940a84B12E276E13f0529'
//     await getFulfillAnListingParams(collectionSlug, tokenId, buyerAddress)
// })()

module.exports = {
    getFulfillAnListingParams: getFulfillAnListingParams
}