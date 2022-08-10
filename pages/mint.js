import { Form, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import { nftAbi, achieverAbi, nftAddress, achieverAddress } from "../constants"
import { useEffect, useState } from "react"

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

    const [cost, setCost] = useState(0)
    const [mintAmount, setMintAmount] = useState(0)

    async function handleSubmit() {
        console.log({ mintAmount, cost })
        // if no value selecteed do thing
        if (!mintAmount) {
            displayNotification("Error: No Value Selected", "error")
            return
        }

        // Approve token
        approveOptions.params = {
            spender: nftAddress,
            amount: cost,
        }

        await runContractFunction({
            params: approveOptions,
            onError: (error) => console.log(error),
            onSuccess: () => {
                console.log("suces")
                mintNFT()
            },
        })
    }

    async function mintNFT() {
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
    }

    function displayNotification(title, type) {
        dispatch({
            type: type,
            title: title,
            position: "topR",
        })
    }
    async function handleChange(e) {
        let currentMintAmount = e.target.value
        let calculatedCost = await calculateCost(currentMintAmount)
        setCost(calculatedCost.toString())
        setMintAmount(currentMintAmount)
    }

    const calculateCost = async (n) => (await getCost()) * n

    async function getCost() {
        let cost = await NFTCost({ onError: (error) => console.log(error) })
        return cost
    }

    return (
        <div className="px-5">
            <Form
                onSubmit={handleSubmit}
                onChange={handleChange}
                id="mint-form"
                data={[
                    {
                        selectOptions: [
                            {
                                id: "1",
                                label: "1",
                            },
                            {
                                id: "2",
                                label: "2",
                            },
                            {
                                id: "3",
                                label: "3",
                            },
                            {
                                id: "4",
                                label: "4",
                            },
                            {
                                id: "5",
                                label: "5",
                            },
                        ],
                        name: "Amount to mint (Max: 5)",
                        type: "select",
                        value: "",
                    },
                ]}
                title="NFT MINT NOW!!"
            ></Form>
        </div>
    )
}
