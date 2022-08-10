import { useWeb3Contract } from "react-moralis"
import { wethAbi, wethAddress, mutualsAbi, mutualsAddress } from "../../constants"
import { Button, useNotification, Form } from "web3uikit"
import { ethers } from "ethers"
import { useState } from "react"
export default function JumpForm() {
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()
    let approveOptions = {
        abi: wethAbi,
        contractAddress: wethAddress,
        functionName: "approve",
    }
    let removeLiquidityOptions = {
        abi: mutualsAbi,
        contractAddress: mutualsAddress,
        functionName: "removeLiquidity",
    }

    const [amountToRemove, setAmountToRemove] = useState("")
    function displayNotification(title, type) {
        dispatch({
            type: type,
            title: title,
            position: "topR",
        })
    }

    async function handleSubmit(form) {
        let removeAmount = form.data[0].inputResult.toString()
        let removeAmountToWei = ethers.utils.parseUnits(removeAmount, "ether").toString()
        let LPShares = getLPShares()
        if (removeAmount < 0 || removeAmount > LPShares) {
            displayNotification("the broken has occured", "error")
        }
        removeLiquidityOptions.params = {
            _shares: removeAmountToWei,
        }
        const tx = await runContractFunction({
            params: removeLiquidityOptions,
            onError: (error) => {
                console.log(error)
                displayNotification("errory", "error")
            },
            onSuccess: () => {
                displayNotification("success", "sucese")
            },
        })
        // const amountToApprove = data.data[0].inputResult
        // approveOptions.params = {
        //     wad: ethers.utils.parseUnits(amountToApprove, "ether").toString(),
        //     guy: mutualsAddress,
        // }
        // console.log("Approving...")
        // const tx = await runContractFunction({
        //     params: approveOptions,
        //     onError: (error) => console.log(error),
        //     onSuccess: () => {
        //         handleApproveSuccess(approveOptions.params.wad)
        //     },
        // })
    }
    const setMax = () => {
        setAmountToRemove(getLPShares())
        console.log(amountToRemove)
    }
    const getLPShares = () => document.querySelector(".lp").textContent

    return (
        <div className="shadow-xl rounded-xl p-8 px-12">
            <Form
                onSubmit={handleSubmit}
                onChange={() => {
                    // baked beans
                    setAmountToRemove(null)
                }}
                data={[
                    {
                        inputWidth: "250px",
                        name: "Amount to remove",
                        type: "number",
                        value: amountToRemove,
                        key: "amountToRemove",
                        validation: { required: true },
                    },
                ]}
                title="Let's do a thing?"
            ></Form>
            <Button
                text="Max"
                onClick={setMax}
                theme="primary"
                style={{
                    position: "relative",
                    bottom: "120px",
                    left: "270px",
                    padding: "6px 12px",
                    fontSize: "1rem",
                }}
            ></Button>
            <div className="LP-Shares">
                Your LP Shares: <span className="font-semibold">idk</span>
            </div>
        </div>
    )
}
