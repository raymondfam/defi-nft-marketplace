import { useWeb3Contract, useMoralis } from "react-moralis"
import { wethAbi, wethAddress, mutualsAbi, mutualsAddress } from "../../constants"
import { useNotification } from "web3uikit"
import { LoadingButton } from "@mui/lab"
import { ethers } from "ethers"
import { useState, useEffect } from "react"
import MutualsDetails from "./MutualsDetails"
export default function JumpForm() {
    // const { address, account, isWeb3Enabled } = useMoralis()
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    let rewardsOptions = {
        abi: mutualsAbi,
        contractAddress: mutualsAddress,
        functionName: "getReward",
    }

    // const { runContractFunction: getEarningsBalance } = useWeb3Contract({
    //     abi: mutualsAbi,
    //     contractAddress: mutualsAddress,
    //     functionName: "earned",
    //     params: {
    //         account: account,
    //     },
    // })

    function displayNotification(title, type) {
        dispatch({
            type: type,
            title: title,
            position: "topR",
        })
    }
    let details = MutualsDetails()
    let earned = details.earningsBalance

    async function handleSubmit() {
        setIsLoading(true)
        await runContractFunction({
            params: rewardsOptions,
            onError: (error) => {
                console.log(error)
                displayNotification(error.message, "error")
                return error
            },
            onSuccess: () => displayNotification(`Successfully claimed ${earned}!`, "success"),
        })
        setIsLoading(false)
    }

    let [isLoading, setIsLoading] = useState(false)
    let [isDisabled, setIsDisabled] = useState(false)
    useEffect(() => {
        if (!Number(earned)) setIsDisabled(true)
        else setIsDisabled(false)
    }, [earned])

    return (
        <div className="shadow-xl rounded-xl p-8 px-12">
            <h3 className="font-bold text-2xl mb-4 text-slate-500">Claim Rewards</h3>
            <p className=" text-lg">
                Rewards Earned: <span className="font-semibold">{earned}</span>
            </p>
            <LoadingButton
                className="p-3 my-3 rounded-xl"
                variant="contained"
                size="large"
                onClick={handleSubmit}
                loading={isLoading}
                disabled={isDisabled}
            >
                Claim rewards
            </LoadingButton>
        </div>
    )
}
