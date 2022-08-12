import styles from "../styles/Home.module.css"
import { useNotification } from "web3uikit"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import nftAbi from "../constants/BasicNFT.json"
import nftMarketplaceAbi from "../constants/NFTExchange.json"
import networkMapping from "../constants/networkMapping.json"
import { useEffect, useState } from "react"
import { FormControl, TextField } from "@mui/material"
import { LoadingButton } from "@mui/lab"
export default function Home() {
    const { chainId, account, isWeb3Enabled } = useMoralis()
    const chainString = chainId ? parseInt(chainId).toString() : "31337"
    const marketplaceAddress = networkMapping[chainString].NftMarketplace[0]
    const dispatch = useNotification()
    const [proceeds, setProceeds] = useState("0")
    const [isLoading, setIsLoading] = useState(false)
    const { runContractFunction } = useWeb3Contract()

    async function approveAndList() {
        setIsLoading(true)
        console.log("Approving...")
        const nftAddress = document.querySelector("#nft-address").value
        const tokenId = document.querySelector("#token-id").value
        const price = document.querySelector("#price").value

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: marketplaceAddress,
                tokenId: tokenId,
            },
        }

        const tx = await runContractFunction({
            params: approveOptions,
            onError: (error) => {
                dispatch({
                    type: "error",
                    title: error.message,
                    position: "topR",
                })
                console.log(error)
                setIsLoading(false)
            },
        })
        await tx.wait(1)
        handleApproveSuccess(nftAddress, tokenId, price)
    }

    async function handleApproveSuccess(nftAddress, tokenId, price) {
        console.log("Ok! Now time to list")
        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: ethers.utils.parseUnits(price, "ether").toString(),
            },
        }
        console.log(listOptions)
        await runContractFunction({
            params: listOptions,
            onSuccess: () => handleListSuccess(),
            onError: (error) => console.log(error),
        })
        setIsLoading(false)
    }

    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "NFT listing",
            title: "NFT listed",
            position: "topR",
        })
    }

    const handleWithdrawSuccess = () => {
        dispatch({
            type: "success",
            message: "Withdrawing proceeds",
            position: "topR",
        })
    }

    async function setupUI() {
        const returnedProceeds = await runContractFunction({
            params: {
                abi: nftMarketplaceAbi,
                contractAddress: marketplaceAddress,
                functionName: "getProceeds",
                params: {
                    seller: account,
                },
            },
            onError: (error) => console.log(error),
        })
        if (returnedProceeds) {
            setProceeds(returnedProceeds.toString())
        }
    }

    useEffect(() => {
        setupUI()
    }, [proceeds, account, isWeb3Enabled, chainId])

    return (
        <div className="flex flex-col items-center p-4">
            <div className="w-1/2 flex flex-col">
                <h3 className="font-bold text-2xl my-4 text-slate-500">Mint an NFT!</h3>
                <FormControl className="gap-6">
                    <TextField id="nft-address" label="NFT Address" size="small" />
                    <TextField id="token-id" label="Token ID" size="small" />
                    <TextField id="price" type="number" label="Price (in ETH)" size="small" />
                </FormControl>
                <LoadingButton
                    className="p-2.5 my-6 rounded-xl w-1/2 max-w-[115px]"
                    variant="contained"
                    size="medium"
                    onClick={approveAndList}
                    loading={isLoading}
                >
                    Mint
                </LoadingButton>
                <div>
                    <div className="text-lg">
                        Proceeds:<span className="font-bold"> {proceeds}</span>{" "}
                    </div>
                    {proceeds != "0" ? (
                        <LoadingButton
                            variant="contained"
                            className="p-3 my-6 rounded-xl w-1/2 max-w-[115px]"
                            onClick={() => {
                                runContractFunction({
                                    params: {
                                        abi: nftMarketplaceAbi,
                                        contractAddress: marketplaceAddress,
                                        functionName: "withdrawProceeds",
                                        params: {},
                                    },
                                    onError: (error) => console.log(error),
                                    onSuccess: () => handleWithdrawSuccess,
                                })
                            }}
                        >
                            Withdraw
                        </LoadingButton>
                    ) : (
                        <div>No proceeds detected</div>
                    )}
                </div>
            </div>
        </div>
    )
    // <div className={styles.container}>
    //     <Form
    //         onSubmit={approveAndList}
    //         data={[
    //             {
    //                 name: "NFT Address",
    //                 type: "text",
    //                 inputWidth: "50%",
    //                 value: "",
    //                 key: "nftAddress",
    //                 validation: { required: true },
    //             },
    //             {
    //                 name: "Token ID",
    //                 type: "number",
    //                 value: "",
    //                 key: "tokenId",
    //                 validation: { required: true },
    //             },
    //             {
    //                 name: "Price (in ETH)",
    //                 type: "number",
    //                 value: "",
    //                 key: "price",
    //                 validation: { required: true },
    //             },
    //         ]}
    //         title="Sell your NFT!"
    //         id="Main Form"
    //     />
    //     <div className="p-4">
    //         <div>Withdraw {proceeds} proceeds</div>
    //         {proceeds != "0" ? (
    //             <Button
    //                 onClick={() => {
    //                     runContractFunction({
    //                         params: {
    //                             abi: nftMarketplaceAbi,
    //                             contractAddress: marketplaceAddress,
    //                             functionName: "withdrawProceeds",
    //                             params: {},
    //                         },
    //                         onError: (error) => console.log(error),
    //                         onSuccess: () => handleWithdrawSuccess,
    //                     })
    //                 }}
    //                 text="Withdraw"
    //                 type="button"
    //             />
    //         ) : (
    //             <div>No proceeds detected</div>
    //         )}
    //     </div>
    // </div>
}
