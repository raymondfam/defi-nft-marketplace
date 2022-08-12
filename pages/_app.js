import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import React from "react"
import Header from "../components/Header"
import Head from "next/head"
import { NotificationProvider } from "web3uikit"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"
import { CssBaseline } from "@mui/material"
const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/31980/nft-exchange/v0.0.1",
})

function MyApp({ Component, pageProps }) {
    return (
        <CssBaseline>
            <div>
                <Head>
                    <title>NFT Marketplace</title>
                    <meta name="description" content="NFT Marketplace" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <MoralisProvider initializeOnMount={false}>
                    <ApolloProvider client={client}>
                        <NotificationProvider>
                            <Header />
                            <Component {...pageProps} />
                        </NotificationProvider>
                    </ApolloProvider>
                </MoralisProvider>
            </div>
        </CssBaseline>
    )
}

export default MyApp
