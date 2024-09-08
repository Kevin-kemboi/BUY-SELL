import { categories } from '@/lib/constants'

const LeftSidebar = () => {
  return (
    <div className='border-r border-dark-4 h-[95vh] w-[200px] px-1 flex flex-col gap-2'>
        <h2 className='text-[10px] text-dark-5/70'>COLLECTIONS</h2>
        <div className=" w-full flex flex-col gap-0.5">
            {
                categories.map((item)=>(
                    <p className='text-[12px] font-semibold cursor-pointer' key={item} >{item} </p>
                ))
            }
        </div>
    </div>
  )
}

export default LeftSidebar