import { Form, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import { nftAbi, achieverAbi, nftAddress, achieverAddress } from "../constants"
import { useState } from "react"
import { LoadingButton } from "@mui/lab"
import { Select, InputLabel, MenuItem, FormControl } from "@mui/material"
export default function Mint() {
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    const approveOptions = {
        abi: achieverAbi,
        contractAddress: achieverAddress,
        functionName: "approve",
    }

    const mintOptions = {
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "mint",
    }

    const { runContractFunction: NFTCost } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "cost",
        params: {},
    })

    async function handleSubmit() {
        setIsLoading(true)
        const mintAmount = document.querySelector("#mint-amount").textContent

        const cost = (await calculateCost(mintAmount)).toString()
        // Approve token
        approveOptions.params = {
            spender: nftAddress,
            amount: cost,
        }

        const tx = await runContractFunction({
            params: approveOptions,
            onError: (error) => console.log(error),
        })
        if (!tx) {
            setIsLoading(false)
            return
        }
        await tx.wait(1)
        mintNFT(mintAmount, cost)
    }

    async function mintNFT(mintAmount, cost) {
        // run mint function
        mintOptions.params = {
            _mintAmount: mintAmount,
            _amountIn: cost,
        }

        await runContractFunction({
            params: mintOptions,
            onError: (error) => {
                console.log(error)
                displayNotification("Error: Rejected", "error")
            },
            onSuccess: () => displayNotification("Successfully minted NFT", "success"),
        })
        setIsLoading(false)
    }

    function displayNotification(title, type) {
        dispatch({
            type: type,
            title: title,
            position: "topR",
        })
    }
    // async function handleChange() {
    //     const mintAmount = document.querySelector("#mint-amount").textContent
    //     let calculatedCost = await calculateCost(currentMintAmount)
    //     setCost(calculatedCost.toString())
    //     setMintAmount(currentMintAmount)
    // }

    const calculateCost = async (n) => (await getCost()) * n

    async function getCost() {
        let cost = await NFTCost({ onError: (error) => console.log(error) })
        return cost
    }
    const [isLoading, setIsLoading] = useState(false)
    return (
        <div className="flex flex-col items-center px-9">
            <div className="flex flex-col gap-2">
                <h3 className="font-bold text-2xl my-4 text-slate-500">Mint an NFT</h3>
                <FormControl variant="standard" id="fart">
                    <InputLabel id="select">Amount to mint</InputLabel>
                    <Select
                        label="select"
                        className="w-1/2 min-w-[240px]"
                        id="mint-amount"
                        defaultValue="1"
                    >
                        <MenuItem value="1">1</MenuItem>
                        <MenuItem value="2">2</MenuItem>
                        <MenuItem value="3">3</MenuItem>
                        <MenuItem value="4">4</MenuItem>
                        <MenuItem value="5">5</MenuItem>
                    </Select>
                </FormControl>
                <LoadingButton
                    className="p-2.5 my-3 rounded-xl w-1/2 max-w-[100px]"
                    variant="contained"
                    size="medium"
                    onClick={handleSubmit}
                    loading={isLoading}
                >
                    Mint
                </LoadingButton>
            </div>
        </div>
    )
}
