import { BentoCard, BentoGrid } from '@/components/magicui/bento-grid'
import { usersMenu } from '@/zin-admin/lib/constants'

const Users = () => {
  return (
    <>
        <div className=" absolute inset-0 flex p-5 gap-2 max-sm:p-2">
        <BentoGrid className="grid-rows-2 md:grid-cols-2  ">
          {usersMenu.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </div>
    </>
  )
}

export default Users