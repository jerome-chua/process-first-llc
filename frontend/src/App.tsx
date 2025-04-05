import './App.css'
import { DataTable } from './DataTable'
import { NavigationBar } from './NavigationBar'

function App() {
  return (
    <>
      <NavigationBar />
      <DataTable columns={[]} data={[]} />
    </>
  )
}

export default App
