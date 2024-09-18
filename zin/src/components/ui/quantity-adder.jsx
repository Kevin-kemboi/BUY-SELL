import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Minus, Plus } from 'lucide-react'

export default function Quantity({itemQuantity}) {
  const [quantity, setQuantity] = useState(itemQuantity)

  const decrease = () => {
    setQuantity(prev => Math.max(0, prev - 1))
  }

  const increase = () => {
    setQuantity(prev => prev + 1)
  }

  return (
    <div className="flex items-center justify-center h-7 w-max  rounded-md border border-dark-4 overflow-hidden">
      <Button 
        className="h-full p-2 bg-transparent text-dark-5/70 hover:text-white  rounded-full " 
        onClick={decrease}
        aria-label="Decrease quantity"
      >
        <Minus className='w-3'/>
      </Button>
      <div className="text-center text-xs  min-w-[14px]" aria-live="polite">
        {quantity}
      </div>
      <Button 
        className="h-full p-2 bg-transparent text-dark-5/70 hover:text-white rounded-full " 
        onClick={increase}
        aria-label="Increase quantity"
      >
        <Plus className='w-3'/>
      </Button>
    </div>
  )
}