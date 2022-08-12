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
import { TextField, Button, FormControl } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import MutualsDetails from "./MutualsDetails"
export default function MutualsStakeForm() {
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useNotification()
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

    async function handleStakeSubmit(e) {
        const wethAmount = document.querySelector("#Token1").value
        const achAmount = document.querySelector("#Token0").value
        if (Number(wethAmount) <= 0) {
            setIsLoading(false)
            return
        }

        wethApproveOptions.params = {
            wad: ethers.utils.parseUnits(wethAmount, "ether").toString(),
            guy: mutualsAddress,
        }

        achApproveOptions.params = {
            amount: ethers.utils.parseUnits(achAmount, "ether").toString(),
            spender: mutualsAddress,
        }

        const wethTx = await runContractFunction({
            params: wethApproveOptions,
            onError: (error) => console.log(error),
        })
        if (!wethTx) {
            setIsLoading(false)
            return
        }
        const achTx = await runContractFunction({
            params: achApproveOptions,
            onError: (error) => console.log(error),
        })
        if (!achTx) {
            setIsLoading(false)
            return
        }
        await achTx.wait(1)

        handleApproveSuccess(wethApproveOptions.params.wad, achApproveOptions.params.amount)
    }

    async function handleApproveSuccess(WETHAmount, ACHAmount) {
        stakeOptions.params = {
            _amount0: WETHAmount,
            _amount1: ACHAmount,
        }

        const tx = await runContractFunction({
            params: stakeOptions,
            onError: (error) => console.log(error),
        })
        dispatch({ type: "success", title: "Staked token successfully!", position: "topR" })
        setIsLoading(false)

        document.querySelector("#Token1").value = ""
        document.querySelector("#Token0").value = ""
        await tx.wait(1)
        console.log("Transaction has confirmed by 1 block")
    }
    async function handleChange(e) {
        console.log(e.target.id)
        if (e.target.value < 0) {
            e.target.value = 0
            return
        }

        let fixed = Number(e.target.value).toFixed(16)
        let amount = ethers.utils.parseUnits(fixed, "ether").toString()

        getTokenOptions.functionName = `calculate${e.target.id}Amount`
        getTokenOptions.params = e.target.id == "Token1" ? { x: amount } : { y: amount }
        console.log(getTokenOptions)
        const tx = await runContractFunction({
            params: getTokenOptions,
            onError: (error) => console.log(error),
        })
        const formattedAmount = ethers.utils.formatEther(tx).toString()

        let wethInput = document.querySelector("#Token1")
        let achInput = document.querySelector("#Token0")
        if (e.target.id == "Token1") achInput.value = formattedAmount
        else wethInput.value = formattedAmount
    }
    const details = MutualsDetails()

    return (
        <div className="shadow-2xl rounded-xl p-8 px-12">
            <h3 className="font-bold text-2xl mb-4 text-slate-500">Let's Stake!</h3>
            <FormControl className="flex flex-col gap-6 py-2">
                <TextField
                    className="w-1/2"
                    id="Token0"
                    label="Amount to stake (in ACH)"
                    size="small"
                    onChange={handleChange}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    required
                />
                <TextField
                    className="w-1/2"
                    id="Token1"
                    label="Amount to stake (in WETH)"
                    size="small"
                    onChange={handleChange}
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    required
                />
                <div>
                    <div>
                        Your ACH Balance:
                        <span className="font-bold"> {details.achBalance}</span>
                    </div>
                    <div>
                        Your WETH Balance: <span className="font-bold">{details.wethBalance}</span>
                    </div>
                </div>
                <LoadingButton
                    variant="contained"
                    className="max-w-[150px] rounded-lg p-2"
                    type="submit"
                    onClick={(e) => {
                        setIsLoading(true)
                        handleStakeSubmit(e)
                    }}
                    loading={isLoading}
                >
                    stake token
                </LoadingButton>
            </FormControl>
        </div>
    )
}
