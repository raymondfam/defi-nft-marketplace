import { useWeb3Contract } from "react-moralis"
import {
    wethAbi,
    wethAddress,
    mutualsAbi,
    mutualsAddress,
    achieverAbi,
    achieverAddress,
} from "../../constants"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import { useState } from "react"
import { TextField, Button, Select, MenuItem, FormControl, InputLabel } from "@mui/material"
import MutualsDetails from "./MutualsDetails"

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
    const [tokenSelected, setTokenSelected] = useState("")
    const [isDisabled, setIsDisabled] = useState(false)

    const details = MutualsDetails()

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

    async function handleSwapSubmit(e) {
        e.preventDefault()
        let approveOptions
        const amountToApprove = document.querySelector("#swap-amount").value
        if (amountToApprove <= 0) {
            setIsDisabled(false)
            return
        }

        setIsDisabled(true)

        const formattedAmount = ethers.utils.parseUnits(amountToApprove, "ether").toString()
        if (tokenSelected == "WETH") {
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
                setIsDisabled(false)
            },
        })
        if (!tx) return
        await tx.wait(1)
        handleApproveSuccess(approveOptions.contractAddress, formattedAmount)
    }
    async function handleApproveSuccess(contractAddress, amountToSwapFormatted) {
        swapOptions.params = {
            _amountIn: amountToSwapFormatted,
            _tokenIn: contractAddress,
        }
        console.log(`Swapping ${swapOptions.params._amountIn} ...`)
        const tx = await runContractFunction({
            params: swapOptions,
            onSuccess: () =>
                dispatch({ title: "Successfully Swapped", type: "success", position: "topR" }),
        })
        await tx.wait(1)
        console.log("Transaction has confirmed by 1 block")
    }

    async function handleSwapChanged(data) {
        const SWAP_AMOUNT = document.querySelector("#swap-amount")
        if (isNaN(data.target.value)) {
            SWAP_AMOUNT.value = ""
            setSwapResult(0)
            setTokenSelected(data.target.value)
        } else {
            setSwapResult(await getTokenSwapAmount(SWAP_AMOUNT.value))
        }
    }

    async function getTokenSwapAmount(amount) {
        if (!tokenSelected) return 0

        const RESERVE0 = ethers.utils.formatEther(await getReserve0())
        const RESERVE1 = ethers.utils.formatEther(await getReserve1())

        let tokenReserve = null
        if (tokenSelected == "ACH") tokenReserve = [RESERVE0, RESERVE1]
        else tokenReserve = [RESERVE1, RESERVE0]

        let [reserveIn, reserveOut] = tokenReserve
        let amountInWithFee = (amount * 997) / 1000
        let amountOut = (+reserveOut * amountInWithFee) / (+reserveIn + amountInWithFee)
        return amountOut
    }

    return (
        <div className="shadow-2xl rounded-xl p-8 px-12">
            <h3 className="font-bold text-2xl mb-4 text-slate-500">Let's swap!</h3>
            <form action="" className="flex flex-col gap-6 py-2">
                <FormControl size="small" className="w-1/2">
                    <InputLabel id="select">Select a token</InputLabel>
                    <Select value={tokenSelected} onChange={handleSwapChanged} label="select">
                        <MenuItem value="ACH">ACH</MenuItem>
                        <MenuItem value="WETH">WETH</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    className="w-1/2"
                    id="swap-amount"
                    label="Amount to swap"
                    size="small"
                    onChange={handleSwapChanged}
                    type="number"
                    required
                />
                <div className="info text-lg">
                    <p>
                        Corresponding Token Out: <span className="font-bold"> {swapResult}</span>
                    </p>
                    <div>
                        Your ACH Balance:<span className="font-bold"> {details.achBalance}</span>
                    </div>
                    <div>
                        Your WETH Balance: <span className="font-bold">{details.wethBalance}</span>
                    </div>
                </div>
                <Button
                    variant="contained"
                    className="w-20 rounded-lg"
                    type="submit"
                    onClick={handleSwapSubmit}
                    disabled={isDisabled}
                >
                    Submit
                </Button>
            </form>
        </div>
    )
}
