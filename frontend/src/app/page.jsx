import styles from "./page.module.css"
import { LinkedButton } from "@/components/buttonLong"

const home = () => {
  return (
    <div styles={styles.page}>
      <LinkedButton title="Auth" href="/auth" />
      <LinkedButton title="Generate" href="/generate" />
    </div>
  )
}

export default home
