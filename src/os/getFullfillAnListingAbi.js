const { getFulfillAnListingParams } = require('./getBestListingFullfillData.js')
const { ethereum_provider_url } = require('../config/os-config.js')
const seaportAbi = require('./seaport-abi.json')
const Web3 = require('web3')
const web3 = new Web3(ethereum_provider_url)

async function fulfillBasicOrder_efficient_6GL6yc_abi(collectionSlug, tokenId, buyerAddress) {
    const responseData = await getFulfillAnListingParams(collectionSlug, tokenId, buyerAddress)
    const parameters = responseData.fulfillment_data.transaction.input_data.parameters

    const contractAbi = seaportAbi
    const contractAddress = '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC'
    const contract = new web3.eth.Contract(contractAbi, contractAddress)

    let encoded = contract.methods.fulfillBasicOrder_efficient_6GL6yc(parameters).encodeABI()
    encoded = encoded + '00000000360c6ebe'
    console.log('encoded: ', encoded)
    return encoded
}


!(async function () {
    /**
     * boredapeyachtclub
     * 0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d
     * 9044
     */
    const collectionSlug = 'boredapeyachtclub';
    const tokenId = 9908
    const buyerAddress = '0xf011F97d87Ba4ac949C940a84B12E276E13f0529'
    const encoded = await fulfillBasicOrder_efficient_6GL6yc_abi(collectionSlug, tokenId, buyerAddress)
})()