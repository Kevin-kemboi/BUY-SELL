import { Modal, ModalBody, ModalContent, ModalFooter, ModalTrigger } from "@/components/ui/animated-modal";

const UpdateModal = () => {
  return (
    <Modal>
      <ModalTrigger className="bg-transparent flex justify-center">
        <img src="/icons/edit.svg" height={20} width={20} alt="" />
      </ModalTrigger>
      <ModalBody >
        <ModalContent>
          <h4 className="text-lg md:text-2xl text-neutral-600 dark:text-neutral-100 font-bold text-center mb-8">
            Book your trip to{" "}
            <span className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800 dark:border-neutral-700 border border-gray-200">
              Bali
            </span>{" "}
            now! ✈️
          </h4>
        </ModalContent>
        <ModalFooter className="gap-4">
          <button className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28">
            Cancel
          </button>
          <button className="bg-black text-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28">
            Book Now
          </button>
        </ModalFooter>
      </ModalBody>
    </Modal>
  );
};

export default UpdateModal;
