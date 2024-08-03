import { ModalContent, useModal } from "@/components/ui/animated-modal";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getProductById, updateProduct } from "../lib/api/api";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name must be at least 1 character long" })
    .max(70, { message: "Name must be at most 70 characters long" }),
  description: z
    .string()
    .min(1, { message: "Description must be at least 1 character long" })
    .max(100, { message: "Description must be at most 100 characters long" }),
  price: z
    .string()
    .min(1, { message: "Price must be at least 1 character long" }),
  category: z
    .string()
    .min(1, { message: "Category must be a non-empty string" }),
  stock: z
    .string()
    .min(1, { message: "Stock must be at least 1 character long" }),
  imageUrl: z.string().optional(),
});

const UpdateModal = ({ product, refreshProducts }) => {
  const { toast } = useToast();
  const { setOpen } = useModal();


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      imageUrl: "",
    },
  });

  //currently havent implemented add photo to product feature, will do later
  // 2. Define a submit handler.
  async function onSubmit(values) {
    const update = await updateProduct(product._id, values);
    if (update.success) {
      toast({
        title: "Product updated successfully",
      });
      setOpen(false)
      refreshProducts();
    } else {
      toast({
        title: "Failed to update product",
      });
    }
  }

  const updateForm = async () => {
    form.reset(product);
  };

  useEffect(() => {
    updateForm();
  }, []);

  return (
    <ModalContent>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-dark-3 p-5 rounded-xl w-full mx-auto flex flex-col gap-3  flex-grow  "
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-end-3 col-start-1 ">
                <FormLabel>Product name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product name"
                    className="bg-dark-4 border border-dark-4   h-12 "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product description"
                    className="bg-dark-4 border border-dark-4   h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product price"
                    className="bg-dark-4 border border-dark-4   h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter product category"
                    className="bg-dark-4 border border-dark-4   h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter stock"
                    className="bg-dark-4 border border-dark-4   h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-5">Submit</Button>
        </form>
      </Form>
    </ModalContent>
  );
};

export default UpdateModal;
