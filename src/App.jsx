import { Toaster } from 'sonner'
import Dashboard from './components/Dashboard'

function App() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Dashboard />
      <Toaster />
    </div>
  )
}

export default App
