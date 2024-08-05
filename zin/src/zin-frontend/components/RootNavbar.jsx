import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const RootNavbar = () => {
  return (
    <nav className="bg-dark-4 p-3 px-7 w-full flex justify-between items-center">
      <div className="">
        <div className="flex gap-3 items-center justify-center">
          <img src="/icons/login.svg" alt="" className="h-9" />
          <h5>All</h5>
        </div>
      </div>
      <div className="">
        <Sheet>
          <SheetTrigger>
            {" "}
            <img src="/icons/delete.svg" alt="" />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default RootNavbar;
