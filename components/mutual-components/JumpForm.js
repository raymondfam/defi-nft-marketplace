import { useWeb3Contract } from "react-moralis"
import { wethAbi, wethAddress, mutualsAbi, mutualsAddress } from "../../constants"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import MutualsDetails from "./MutualsDetails"
import { TextField, Button } from "@mui/material"
import { LoadingButton } from "@mui/lab"
export default function JumpForm() {
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()
    let removeLiquidityOptions = {
        abi: mutualsAbi,
        contractAddress: mutualsAddress,
        functionName: "removeLiquidity",
    }

    const [isLoading, setIsLoading] = useState(false)

    function displayNotification(title, type) {
        dispatch({
            type: type,
            title: title,
            position: "topR",
        })
    }
    const getLPShares = () => {
        let details = MutualsDetails()

        return [details.lpBalance, details.totalLPBalance]
    }
    let [LPShares, contractLPShares] = getLPShares()

    async function handleSubmit() {
        setIsLoading(true)
        let removeAmount = document.querySelector("#amount-to-remove").value
        if (removeAmount <= 0 || removeAmount > LPShares) {
            setIsLoading(false)
            return
        }
        let removeAmountInWei = ethers.utils.parseUnits(removeAmount, "ether").toString()
        removeLiquidityOptions.params = {
            _shares: removeAmountInWei,
        }
        await runContractFunction({
            params: removeLiquidityOptions,
            onError: (error) => displayNotification(error.message, "error"),
            onSuccess: () => displayNotification(`Removed ${removeAmount} LP shares`, "success"),
        })
        setIsLoading(false)
    }

    const setMax = () => {
        let textField = document.querySelector("#amount-to-remove")
        textField.focus()
        textField.value = LPShares
    }

    return (
        <div className="shadow-xl rounded-xl p-8 px-12">
            <h3 className="font-bold text-2xl mb-4 text-slate-500">Remove Liquidity</h3>
            <div className="flex flex-col gap-6 py-2">
                <div className="flex gap-1">
                    <TextField
                        className="w-1/2"
                        id="amount-to-remove"
                        size="small"
                        type="number"
                        required
                        label="Amount to remove"
                        onChange={(e) => {
                            if (e.target.value < 0) e.target.value = 0
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button
                        variant="contained"
                        className="bg-emerald-500 rounded-md"
                        onClick={setMax}
                    >
                        Max
                    </Button>
                </div>
                <div className="text-lg">
                    LP Shares: <span className="font-bold">{LPShares}</span>
                    <br></br>
                    Contract LP Shares: <span className="font-bold">{contractLPShares}</span>
                </div>
                <LoadingButton
                    variant="contained"
                    className="max-w-[110px] rounded-lg p-2"
                    type="submit"
                    onClick={handleSubmit}
                    loading={isLoading}
                >
                    Submit
                </LoadingButton>
            </div>
        </div>
    )
}
