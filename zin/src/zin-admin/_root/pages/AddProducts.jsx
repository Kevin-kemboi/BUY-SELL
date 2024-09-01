"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

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
import { useToast } from "@/components/ui/use-toast";
import { addProduct } from "@/lib/api/api";

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

const AddProducts = () => {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState(null); // State to hold the image preview
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // State to store the uploaded image URL





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

  const onSubmit = async (values) => {
    // Construct the body for adding the product
    const body = {
      name: values.name,
      description: values.description,
      price: parseFloat(values.price),
      category: values.category,
      stock: parseInt(values.stock, 10),
      imageUrl: uploadedImageUrl, // Use the uploaded image URL
    };

    console.log({body})

    // Add the product
    const data = await addProduct(body);
    if (data.success) {
      toast({
        title: "Product added successfully",
      });
      form.reset();
      setUploadedImageUrl("");
      setImagePreview(false); // Reset the uploaded image URL after submission

    } else {
      toast({
        title: data.error,
      });
    }
  };
  

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setImagePreview(URL.createObjectURL(file)); // Set the image preview

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/admin/api/upload", {
        method: "POST",
        body: formData,
      });
      console.log(response)
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      console.log("Uploaded file:", data);
      const imageUrl = `http://localhost:5173/uploads/${data.filename}`; // Construct the image URL
      console.log(URL.createObjectURL(file))
      setUploadedImageUrl(imageUrl); // Store the uploaded image URL
      // You can now use data.filename or whatever the server returns
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }, []);
  

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 1,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-dark-2 p-5 rounded-xl w-full mx-auto flex flex-col sm:grid sm:grid-cols-2 sm:items-center gap-6 min-h-[600px]"
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
                  {...field}
                  className="bg-dark-3 border border-white/20 h-12 "
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
                  {...field}
                  className="bg-dark-3 border border-white/20 h-12"
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
                  {...field}
                  className="bg-dark-3 border border-white/20 h-12"
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
                  {...field}
                  className="bg-dark-3 border border-white/20 h-12"
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
                  {...field}
                  className="bg-dark-3 border border-white/20 h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem className="col-end-3 col-start-1">
              <FormLabel>Image</FormLabel>
              <div
                {...getRootProps()}
                className="border-dashed border-2 border-gray-500 p-5 rounded-md cursor-pointer h-[300px] flex items-center justify-center max-sm:h-[150px]"
              >
                <input {...getInputProps()} />
                {!imagePreview &&

                  <p>Drag & drop an image here, or click to select one</p>
                }
                {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Image Preview" className="h-32 object-cover rounded-md" />
                </div>
              )}
              </div>
              
              <FormControl>
                <Input type="hidden" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="col-start-1 col-end-3 py-2">
          Add product
        </Button>
      </form>
    </Form>
  );
};

export default AddProducts;
