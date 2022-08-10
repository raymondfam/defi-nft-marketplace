import { useWeb3Contract, useMoralis } from "react-moralis"
import { wethAbi, wethAddress, mutualsAbi, mutualsAddress } from "../../constants"
import { Button, useNotification, Form } from "web3uikit"
import { ethers } from "ethers"
import { useState, useEffect } from "react"
export default function JumpForm() {
    const { address, account, isWeb3Enabled } = useMoralis()
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    let rewardsOptions = {
        abi: mutualsAbi,
        contractAddress: mutualsAddress,
        functionName: "getReward",
    }

    const { runContractFunction: getEarningsBalance } = useWeb3Contract({
        abi: mutualsAbi,
        contractAddress: mutualsAddress,
        functionName: "earned",
        params: {
            account: account,
        },
    })

    function displayNotification(title, type) {
        dispatch({
            type: type,
            title: title,
            position: "topR",
        })
    }

    let [earned, setEarned] = useState("")
    async function handleSubmit() {
        const tx = await runContractFunction({
            params: rewardsOptions,
            onError: (error) => {
                console.log(error)
                displayNotification(error.message, "error")
                return error
            },
            onSuccess: () => {
                displayNotification(`Successfully claimed ${earned}!`, "success")
            },
        })
    }
    const setRewardsEarned = async () => {
        let balance = await getEarningsBalance()
        setEarned(ethers.utils.formatEther(balance).toString())
    }
    useEffect(() => {
        if (isWeb3Enabled && account) {
            setRewardsEarned()
        }
    }, [account, isWeb3Enabled])
    return (
        <div className="shadow-xl rounded-xl p-8 px-12">
            <h3 className="font-bold text-2xl mb-4 text-slate-500">Claim Rewards</h3>
            <Button
                text="Claim all rewards"
                theme="primary"
                style={{ padding: "8px", margin: "12px 0px" }}
                onClick={handleSubmit}
                // disabled={earned <= 0 ? true : false}
            ></Button>
            <p className=" text-lg">
                Rewards Earned: <span className="font-semibold">{earned}</span>
            </p>
        </div>
    )
}
