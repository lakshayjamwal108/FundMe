const networkConfig={
    11155111: {
        name : "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306"

    },
    137: {
        name : "polygon",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945"
    },
    1101:{
        name: "zkevm",
        ethUsdPriceFeed: "0x0541F2746A05C58CBf04f2935f8c3Eb7e06Ab3E7"

    }

}

const developmentChains = ["hardhat", "localhost"]
const DECIMALS = 8
const INITIAL_ANSWER = 200000000000
module.exports={
    networkConfig,
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER
}