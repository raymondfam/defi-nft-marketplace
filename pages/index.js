import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import MutualsDetails from "../components/mutual-components/MutualsDetails"
import MutualsSwapForm from "../components/mutual-components/MutualsSwapForm"
import MutualsStakeForm from "../components/mutual-components/MutualsStakeForm"
import JumpForm from "../components/mutual-components/JumpForm"
import MutualsClaimForm from "../components/mutual-components/MutualsClaimForm"
export default function Home() {
    let styling = {
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        width: "85vw",
    }
    return (
        <div
            className={styles.container}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                alignItems: "center",
            }}
        >
            <div className="grid gap-12 pt-7" style={styling}>
                <MutualsSwapForm />
                <MutualsStakeForm />
            </div>
            <div className="grid gap-12" style={styling}>
                <JumpForm />
                <MutualsClaimForm />
            </div>

            <MutualsDetails />
        </div>
    )
}
