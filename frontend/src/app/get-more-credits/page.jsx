import styles from "./page.module.css"
import { PlanCard } from "@/components/plan_card"

const Plans = () => {

  const basic_features = [
    '50 Credits',
    '10 FREE Worksheet Generations',
    'Weekly Credits Renewal'
  ]

  const standard_features = [
    '1000 Credits',
    '100 Worksheet Generations',
    'Securely Saved Worksheets for 1 Month'
  ]

  const pro_features = [
    '3500 Credits',
    '350 Worksheet Generations',
    'Securely Saved Worksheets forever'
  ]

  return (
    <div styles={styles.page}>
      <h1 style={headingStyle}>Check Out Our Subscription Plans</h1>
      <div style={{display: "flex", flexWrap: "wrap", alignItems: 'center', justifyContent: 'center', alignSelf: "center"}}>
        <PlanCard title="Basic" price="0" features={basic_features} isCurrentPlan={false} />
        <PlanCard title="Standard" price="500" features={standard_features} isCurrentPlan={false} />
        <PlanCard title="Pro" price="1500" features={pro_features} isCurrentPlan={false} />
      </div>
    </div>
  )
}

export default Plans

const headingStyle = {
  color: '#fff',
  textAlign: 'center',
  lineHeight: '60px',
  marginTop: '80px',
  marginBottom: '50px',
}
