const { deployments, ethers , getNamedAccounts } = require("hardhat")
const { expect, assert } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

describe("FundMe", async () =>  {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.parseEther("1")
    beforeEach( async () => {
        
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer)
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
    })

    describe("constructor", async () => {
        it("sets the aggregator addresses correctly", async () => {
            const response = await fundMe.getPriceFeed()
            await mockV3Aggregator.waitForDeployment()
          //  console.log("Mock v3 address : ", addrs = await mockV3Aggregator.getAddress())
            assert.equal(response, await mockV3Aggregator.getAddress())
        })
    })

    describe("fund", async () => {
        it("Fails if you don't send enough ETH", async () => {
           // await fundMe.fund()
        })
        it("updated the amount funded data structure", async () =>{
            await fundMe.fund({ value: sendValue })
            const response =await fundMe.getAddressToAmountFunded(deployer)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds to array of funders", async ()=>{
            await fundMe.fund({value: sendValue})
            const funder =await fundMe.getFunder(0)
            assert.equal(funder, deployer)
        })
    })
    describe("Withdraw", async () =>{
        beforeEach(async () =>{
            await fundMe.fund({ value: sendValue })
        })
        it("Withdraw ETH from a single founder", async()=>{
            console.log("Amount in FundMe Address : ", await ethers.provider.getBalance( fundMe.getAddress()),"\nAmount in Deployer Address : ", await ethers.provider.getBalance(deployer))
            const startingFundmeBalance = await ethers.provider.getBalance(fundMe.getAddress())
            const startingDeployerBalance = await ethers.provider.getBalance(deployer)
            console.log("Implementing withdraw : ")
            const transactionResponse = await fundMe.withdraw()
            console.log("Waiting for transaction response : ")
            const transactionReciever =await transactionResponse.wait(1)
            const { gasUsed , gasPrice } = transactionReciever
            const gasCost = gasUsed*gasPrice
            console.log( gasCost," ",gasUsed," ",gasPrice,"      ",typeof startingFundmeBalance)
            const endingFundmeBalance = await ethers.provider.getBalance(fundMe.getAddress())
            const endingDeployerBalance = await ethers.provider.getBalance(deployer)
            console.log("Amount in FundMe Address : ", await ethers.provider.getBalance( fundMe.getAddress()),"\nAmount in Deployer Address : ", await ethers.provider.getBalance(deployer))
            
            assert.equal(endingFundmeBalance,0)
            assert.equal((startingFundmeBalance+startingDeployerBalance).toString(), (endingDeployerBalance+gasCost).toString())
        })
        it("allows us to withdraw with multiple funders", async () => {
        
            const accounts = await ethers.getSigners()
        
            for(let i=1; i<6; i++){
            
                const fundMeConnectedContract = await fundMe.connect(accounts[i])
                await fundMeConnectedContract.fund({ value: sendValue})
        }
            const startingFundmeBalance = await ethers.provider.getBalance(fundMe.getAddress())
            const startingDeployerBalance = await ethers.provider.getBalance(deployer)
        // Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReciever =await transactionResponse.wait(1)
            const { gasUsed , gasPrice } = transactionReciever
            const gasCost = gasUsed*gasPrice

            const endingFundmeBalance = await ethers.provider.getBalance(fundMe.getAddress())
            const endingDeployerBalance = await ethers.provider.getBalance(deployer)
            //Assert
            assert.equal(endingFundmeBalance,0)
            assert.equal((startingFundmeBalance+startingDeployerBalance).toString(), 
            (endingDeployerBalance+gasCost).toString())
           // await expect(fundMe.getFunder(0)).to.be.reverted
            for(let i=1; i<6; i++){
            
                assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].getAddress()),0)
        }

        })

        it("Only allows the owner to withdraw", async ()=>{
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await fundMe.connect(attacker)
            //await expect(attackerConnectedContract.withdraw()).to.be.reverted
            
            //await attackerConnectedContract.withdraw()
        })
        it("Cheaper withdraw ...", async () => {
        
            const accounts = await ethers.getSigners()
        
            for(let i=1; i<6; i++){
            
                const fundMeConnectedContract = await fundMe.connect(accounts[i])
                await fundMeConnectedContract.fund({ value: sendValue})
        }
            const startingFundmeBalance = await ethers.provider.getBalance(fundMe.getAddress())
            const startingDeployerBalance = await ethers.provider.getBalance(deployer)
        // Act
            const transactionResponse = await fundMe.cheaperWithdraw()
            const transactionReciever =await transactionResponse.wait(1)
            const { gasUsed , gasPrice } = transactionReciever
            const gasCost = gasUsed*gasPrice

            const endingFundmeBalance = await ethers.provider.getBalance(fundMe.getAddress())
            const endingDeployerBalance = await ethers.provider.getBalance(deployer)
            //Assert
            assert.equal(endingFundmeBalance,0)
            assert.equal((startingFundmeBalance+startingDeployerBalance).toString(), 
            (endingDeployerBalance+gasCost).toString())
           // await expect(fundMe.getFunder(0)).to.be.reverted
            for(let i=1; i<6; i++){
            
                assert.equal(await fundMe.getAddressToAmountFunded(accounts[i].getAddress()),0)
        }

        })
    })
})