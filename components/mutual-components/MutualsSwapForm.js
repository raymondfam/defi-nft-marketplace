import { useWeb3Contract } from "react-moralis"
import {
    wethAbi,
    wethAddress,
    mutualsAbi,
    mutualsAddress,
    achieverAbi,
    achieverAddress,
} from "../../constants"
import { Form, useNotification } from "web3uikit"
import { ethers } from "ethers"
import { useState } from "react"
export default function MutualsSwapForm() {
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    let achieverApproveOptions = {
        abi: achieverAbi,
        contractAddress: achieverAddress,
        functionName: "approve",
    }

    let wethApproveOptions = {
        abi: wethAbi,
        contractAddress: wethAddress,
        functionName: "approve",
    }

    let swapOptions = {
        abi: mutualsAbi,
        contractAddress: mutualsAddress,
        functionName: "swap",
    }

    const [swapResult, setSwapResult] = useState("0")

    const { runContractFunction: getReserve0 } = useWeb3Contract({
        abi: mutualsAbi,
        contractAddress: mutualsAddress,
        functionName: "reserve0",
        params: {},
    })

    const { runContractFunction: getReserve1 } = useWeb3Contract({
        abi: mutualsAbi,
        contractAddress: mutualsAddress,
        functionName: "reserve1",
        params: {},
    })

    // const { runContractFunction: getAllowance } = useWeb3Contract({
    //     abi: achieverAbi,
    //     contractAddress: achieverAddress,
    //     functionName: "allowance",
    //     params: {
    //         owner: "0x8C6bB2BD30f4e28dCD0f6faF6B2d315f67155Abc",
    //         spender: "0x18B4c7C0281E8F19be9Dad2977356064fe8DB86d",
    //     },
    // })

    async function handleSwapSubmit() {
        let selectVal = document.querySelector("#swap-form select").value
        let approveOptions
        const amountToApprove = document.querySelector("#input_1").value
        if (amountToApprove <= 0) {
            dispatch({
                title: "Value must be greater than zero",
                type: "error",
                position: "topR",
            })
            return
        }
        const formattedAmount = ethers.utils.parseUnits(amountToApprove, "ether").toString()
        if (selectVal == "WETH") {
            wethApproveOptions.params = {
                wad: formattedAmount,
                guy: mutualsAddress,
            }
            approveOptions = wethApproveOptions
        } else {
            achieverApproveOptions.params = {
                amount: formattedAmount,
                spender: mutualsAddress,
            }
            approveOptions = achieverApproveOptions
        }
        const tx = await runContractFunction({
            params: approveOptions,
            onError: (error) => {
                console.log(error)
                dispatch({ title: error.message, type: "error", position: "topR" })
            },
        })
        await tx.wait(1)
        handleApproveSuccess(approveOptions.contractAddress, formattedAmount)
    }
    async function handleApproveSuccess(contractAddress, amountToSwapFormatted) {
        swapOptions.params = {
            _amountIn: amountToSwapFormatted,
            _tokenIn: contractAddress,
        }
        console.log({ swapOptions })
        console.log(`Swapping ${swapOptions.params._amountIn} ...`)
        const tx = await runContractFunction({
            params: swapOptions,
        })
        await tx.wait(1)
        console.log("Transaction has confirmed by 1 block")
    }

    async function handleSwapChanged(data) {
        if (data.target.tagName == "SELECT") {
            let swapAmount = document.querySelector("label[for=input_1]")
            swapAmount.textContent = `Amount to swap (in ${data.target.value})`
        } else {
            let tokenSelected = document.querySelector("#swap-form select").value
            let array =
                tokenSelected == "WETH"
                    ? [
                          ethers.utils.formatEther(
                              await getReserve0({ onError: (error) => console.log(error) })
                          ),
                          ethers.utils.formatEther(
                              await getReserve1({ onError: (error) => console.log(error) })
                          ),
                      ]
                    : [
                          ethers.utils.formatEther(
                              await getReserve1({ onError: (error) => console.log(error) })
                          ),
                          ethers.utils.formatEther(
                              await getReserve0({ onError: (error) => console.log(error) })
                          ),
                      ]
            let [reserveIn, reserveOut] = array
            let amountInWithFee = (data.target.value * 997) / 1000
            let amountOut = (+reserveOut * amountInWithFee) / (+reserveIn + amountInWithFee)
            setSwapResult(amountOut)
        }
    }
    return (
        <div className="shadow-2xl rounded-xl p-4">
            <Form
                onSubmit={handleSwapSubmit}
                onChange={handleSwapChanged}
                id="swap-form"
                data={[
                    {
                        selectOptions: [
                            {
                                id: "ACH",
                                label: "ACH",
                            },
                            {
                                id: "WETH",
                                label: "WETH",
                            },
                        ],
                        name: "Select token to swap",
                        type: "select",
                        value: "",
                    },
                    {
                        inputWidth: "50%",
                        name: "Amount to swap",
                        type: "number",
                        value: "",
                        key: "amountToSwap",
                        validation: { required: true },
                    },
                    {
                        value: `Corresponding Token Out: ${swapResult}`,
                        type: "box",
                        key: "swap-result",
                    },
                ]}
                title="Let's swap!"
            ></Form>
        </div>
    )
}
