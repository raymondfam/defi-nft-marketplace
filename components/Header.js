import { ConnectButton } from "web3uikit"
import Link from "next/link"
import CssBaseline from "@mui/material/CssBaseline"

export default function Header() {
    return (
        <CssBaseline>
            <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
                <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
                <div className="flex flex-row items-center">
                    <Link href="/">
                        <a className="mr-4 p-6 no-underline text-black">Home</a>
                    </Link>
                    <Link href="/mint">
                        <a className="mr-4 p-6 no-underline text-black">Mint</a>
                    </Link>
                    <Link href="/sell-nft">
                        <a className="mr-4 p-6 no-underline text-black">Sell NFT</a>
                    </Link>
                    <Link href="/nft">
                        <a className="mr-4 p-6 no-underline text-black">Marketplace</a>
                    </Link>
                    <ConnectButton moralisAuth={false} />
                </div>
            </nav>
        </CssBaseline>
    )
}
