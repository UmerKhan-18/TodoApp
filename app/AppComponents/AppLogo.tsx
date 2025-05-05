import { FaCheckDouble } from 'react-icons/fa'

export function AppLogo() {
  return (
    <div className="flex gap-2 items-center justify-center ml-3 ">    
      
      <div className="text-white rounded-sm text-lg bg-black p-2 shadow-md flex items-center justify-center"> 
        <FaCheckDouble />
      </div>

      <div className="text-2xl font-bold flex gap-1 justify-center items-center">
        <span>Todo</span>
        <span>App</span>
      </div>
    </div>
  )
}