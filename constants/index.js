import networkMapping from "/constants/networkMapping.json"
const chainString = "4"
const achieverAddress = networkMapping[chainString]["Achiever"][0]
const wethAddress = networkMapping[chainString]["WETH"][0]
const mutualsAddress = networkMapping[chainString]["Mutuals"][0]
const nftAddress = networkMapping[chainString]["BasicNFT"][0]
// const mutualsAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
// const achieverAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
// const wethAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

const mutualsAbi = require("./mutualsAbi.json")
const achieverAbi = require("./achieverAbi.json")
const wethAbi = require("./wethAbi.json")
const nftAbi = require("./BasicNFT.json")

module.exports = {
    nftAbi,
    mutualsAbi,
    achieverAbi,
    wethAbi,
    mutualsAddress,
    achieverAddress,
    wethAddress,
    nftAddress,
}
