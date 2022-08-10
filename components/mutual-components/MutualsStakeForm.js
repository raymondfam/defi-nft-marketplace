import { useState } from "react"
import { useWeb3Contract } from "react-moralis"
import {
    wethAbi,
    wethAddress,
    mutualsAbi,
    mutualsAddress,
    achieverAbi,
    achieverAddress,
} from "../../constants"
import { Form } from "web3uikit"
import { ethers } from "ethers"
export default function MutualsStakeForm() {
    const [firstInput, setFirstInput] = useState("")
    const [secondInput, setSecondInput] = useState("")

    const { runContractFunction } = useWeb3Contract()
    let wethApproveOptions = {
        abi: wethAbi,
        contractAddress: wethAddress,
        functionName: "approve",
    }

    let achApproveOptions = {
        abi: achieverAbi,
        contractAddress: achieverAddress,
        functionName: "approve",
    }

    let stakeOptions = {
        abi: mutualsAbi,
        contractAddress: mutualsAddress,
        functionName: "addLiquidity",
    }

    let getTokenOptions = {
        abi: mutualsAbi,
        contractAddress: mutualsAddress,
        functionName: null,
    }

    async function handleStakeSubmit() {
        const wethAmountToApprove = document.querySelector("#stake-form #input_0").value
        if (wethAmountToApprove <= 0) return

        wethApproveOptions.params = {
            wad: ethers.utils.parseUnits(wethAmountToApprove, "ether").toString(),
            guy: mutualsAddress,
        }

        await runContractFunction({
            params: wethApproveOptions,
            onError: (error) => console.log(error),
        })
        const achAmountToApprove = document.querySelector("#stake-form #input_1").value
        achApproveOptions.params = {
            amount: ethers.utils.parseUnits(achAmountToApprove, "ether").toString(),
            spender: mutualsAddress,
        }

        const tx = await runContractFunction({
            params: achApproveOptions,
        })
        await tx.wait(1)
        handleApproveSuccess(wethApproveOptions.params.wad, achApproveOptions.params.amount)
    }
    // const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

    async function handleApproveSuccess(formattedWETHAmount, formattedACHAmount) {
        stakeOptions.params = {
            _amount0: formattedWETHAmount,
            _amount1: formattedACHAmount,
        }
        const tx = await runContractFunction({
            // abi: stakeOptions.abi,
            // contractAddress: stakeOptions.contractAddress,
            // functionName: stakeOptions.functionName,
            params: stakeOptions,
            onError: (error) => console.log(error),
        })
        await tx.wait(1)
        console.log("Transaction has confirmed by 1 block")
    }
    async function handleChange(e) {
        if (e.target.value < 0) return

        let oppositeInputNum = e.target.id == "input_0" ? "1" : "0"
        let fixed = Number(e.target.value).toFixed(16)
        let amount = ethers.utils.parseUnits(fixed, "ether").toString()
        getTokenOptions.functionName = `calculateToken${oppositeInputNum}Amount`
        console.log(amount)
        getTokenOptions.params = oppositeInputNum == "0" ? { y: amount } : { x: amount }
        console.log(getTokenOptions)
        const tx = await runContractFunction({
            params: getTokenOptions,
            onError: (error) => console.log(error),
        })
        console.log({ tx })
        const actualAmount = ethers.utils.formatEther(tx).toString()
        if (oppositeInputNum == "1") {
            setSecondInput(actualAmount)
        } else {
            setFirstInput(actualAmount)
        }
    }
    //let oliveoil = document.querySelectorAll("#stake-form > input")
    return (
        <div className="shadow-2xl rounded-xl p-4">
            <Form
                onSubmit={handleStakeSubmit}
                onChange={handleChange}
                id="stake-form"
                data={[
                    {
                        inputWidth: "50%",
                        name: "Amount to stake (in WETH)",
                        type: "number",
                        value: firstInput,
                        key: "WETH",
                    },
                    {
                        inputWidth: "50%",
                        name: "Amount to stake (in ACH)",
                        type: "number",
                        value: secondInput,
                        key: "ACH",
                    },
                ]}
                title="Let's stake!"
            ></Form>
        </div>
    )
}
