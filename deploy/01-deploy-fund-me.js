//function deployFunc(hre){
//}
require("dotenv").config()

const { network } = require("hardhat")
const {networkConfig, developmentChains} = require("../helper-hardhat-config")



module.exports = async ({getNamedAccounts, deployments }) => {
    const { deploy, log }= deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    const {verify} = require("../utils/verify")
    //const ethUsdPriceFeed= networkConfig[chainId]["ethUsdPriceFeed"]
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    } else{
        ethUsdPriceFeedAddress= networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const args = [ethUsdPriceFeedAddress]
    const fundMe= await deploy("FundMe",{
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    
    log("Using Ether scan Api Key : ",process.env.ETHERSCAN_API_KEY)

    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
       await verify(fundMe.address, args)
    }
    log("---------------------------------------------------")
}
module.exports.tags=["all","fundme"]