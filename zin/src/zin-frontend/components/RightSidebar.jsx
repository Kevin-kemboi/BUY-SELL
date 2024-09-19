import {  sortOptions } from '@/lib/constants'
import SortOptions from './SortOptions'

const RightSidebar = () => {
  return (
    <div className='border-l max-sm:hidden border-dark-4 min-h-[95vh] w-[200px] px-4 flex flex-col gap-2'>
        <h2 className='text-[10px] text-dark-5/70'>SORT BY</h2>
        <div className=" w-full flex flex-col gap-0.5">
            <SortOptions sortBy={sortOptions} />
        </div>
    </div>
  )
}

export default RightSidebar