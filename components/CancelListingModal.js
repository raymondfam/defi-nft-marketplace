import { Modal, useNotification } from "web3uikit"
import { useWeb3Contract } from "react-moralis"
import nftMarketplaceAbi from "../constants/NFTExchange.json"

export default function cancelListingModal({
    nftAddress,
    tokenId,
    isVisible,
    marketplaceAddress,
    onClose,
}) {
    const dispatch = useNotification()

    const displayNotification = () => {
        dispatch({
            type: "success",
            message: "listing canceled",
            title: "Listing canceled - please refresh (and move blocks)",
            position: "topR",
        })
        onClose && onClose()
        setPriceTocancelListingWith("0")
    }

    const { runContractFunction: cancelListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "cancelListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        },
    })

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            okText="Confirm"
            title="Cancel Listing?"
            isCentered={true}
            width="30vw"
            onOk={() => {
                cancelListing({
                    onError: (error) => {
                        console.log(error)
                    },
                    onSuccess: displayNotification,
                })
            }}
        >
            <div class="flex justify-center">
                <p className="py-4 font-bold">Are you sure you want to proceed?</p>
            </div>
        </Modal>
    )
}
