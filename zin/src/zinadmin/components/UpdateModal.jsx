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
import { getVariations, updateProduct } from "../../lib/api/api";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDropzone } from "react-dropzone";
import PropTypes from "prop-types";
import { X } from "lucide-react";

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
  const [imagePreview, setImagePreview] = useState(null); // Image preview state
  const [uploadedImageUrl, setUploadedImageUrl] = useState(product.imageUrl); // State to hold either original or uploaded image URL
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);


  // Set initial options for variations
  useEffect(() => {
    if (product.variations) {
      const variationTypes = product.variations.map(
        (variation) => variation.type
      );
      setSelectedOptions(variationTypes);
    }
  }, [product]);

  useEffect(() => {
    const fetchVariations = async () => {
      try {
        const response = await getVariations(); // Fetch options for variations
        setOptions(response.variations);
      } catch (error) {
        console.error("Error fetching variations:", error);
      }
    };

    fetchVariations();
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name || "",
      description: product.description || "",
      price: product.price ? product.price.toString() : "",
      category: product.category || "",
      stock: product.stock ? product.stock.toString() : "",
      imageUrl: product.imageUrl || "",
      variations: selectedOptions || [],
    },
  });

  // Submit handler
  async function onSubmit(values) {
    const body = {
      name: values.name,
      description: values.description,
      price: parseFloat(values.price),
      category: values.category,
      stock: parseInt(values.stock, 10),
      variations: selectedOptions,
      imageUrl: uploadedImageUrl || product.imageUrl, // Use the new or original image URL
    };

    try {
      const update = await updateProduct(product._id, body);
      if (update.success) {
        toast({ title: "Product updated successfully" });
        setOpen(false);
        refreshProducts();
      } else {
        toast({ title: "Failed to update product" });
      }
    } catch (error) {
      console.log(error.message)
      toast({ title: "Error updating product", description: error.message });
    }
  }

  // Handle file drop and upload image
  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    setImagePreview(URL.createObjectURL(file)); // Show image preview

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_HOST}/admin/api/upload`, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      const imageUrl = `${import.meta.env.VITE_FRONTEND_HOST}/uploads/${data.filename}`;
      setUploadedImageUrl(imageUrl); // Set uploaded image URL
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 1,
  });

  // Handle select change for variations
  const handleSelectChange = (value) => {
    if (!selectedOptions.includes(value)) {
      setSelectedOptions((prev) => [...prev, value]); // Add new variation type
    }
  };

  // Handle removal of selected options
  const handleOptionDelete = (itemToDelete) => {
    setSelectedOptions((prev) => prev.filter((item) => item !== itemToDelete));
    form.setValue(
      "variations",
      selectedOptions.filter((item) => item !== itemToDelete)
    );
  };

  return (
    <ModalContent className={`overflow-y-auto`}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-dark-3 p-5 rounded-xl w-full mx-auto flex flex-col gap-3  flex-grow overflow-y-auto "
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
            name="variations"
            render={({ field }) => (
              <FormItem className="col-end-3 col-start-1">
                <FormLabel>Options</FormLabel>
                <FormControl>
                  <Select onValueChange={handleSelectChange}>
                    <SelectTrigger className="bg-dark-4 w-full">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-4 text-white border-none z-[199]">
                      {options.map((option) => (
                        <SelectItem key={option._id} value={option.type}>
                          {option.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <div className=" w-full flex gap-2 flex-wrap">
                  {selectedOptions.map((item) => (
                    <div
                      key={item}
                      className="border text-xs px-1 rounded-lg flex gap-1 items-center justify-center"
                    >
                      {item}
                      <X
                        className="w-4"
                        onClick={() => handleOptionDelete(item)}
                      />
                    </div>
                  ))}
                </div>
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
                  {!imagePreview && (
                    <p>Drag & drop an image here, or click to select one</p>
                  )}
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Image Preview"
                        className="h-32 object-cover rounded-md"
                      />
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
    </ModalContent>
  );
};

UpdateModal.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    category: PropTypes.string,
    stock: PropTypes.number,
    imageUrl: PropTypes.string,
    variations: PropTypes.arrayOf(
      PropTypes.shape({
        type: PropTypes.string.isRequired, // Assuming `type` is a string
      })
    ),
  }).isRequired, // Product is required
  refreshProducts: PropTypes.func.isRequired, // Assuming this function is required
};

export default UpdateModal;
