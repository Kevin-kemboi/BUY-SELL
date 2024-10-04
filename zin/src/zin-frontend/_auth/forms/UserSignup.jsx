import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

import { createUser } from "../../../lib/api/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useUserAuth } from "@/zin-frontend/context/UserAuthProvider";

const formSchema = z.object({
  name: z.string().min(1).max(50),
  address: z.string().min(1),
  appartment: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  ZIP: z.string().min(1),
  phNo: z.string().min(10),
  email: z.string().email(),
  password: z.string().min(8),
});

const UserSignup = () => {
  const navigate = useNavigate();
  const { setUserEmail } = useUserAuth();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      appartment: "",
      city: "",
      state: "",
      ZIP: "",
      phNo: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    const data = await createUser(values);
    console.log(data)
    if (data.success) {
      navigate("/verify");
      form.reset();
      setUserEmail(data.email)
    } else {
      toast({
        title: data.error,
      });
    }
  }

  return (
    <div className=" md:min-h-[80vh] min-h-[75vh] w-[530px] rounded-md flex items-center justify-start flex-col py-6 max-sm:w-full ">
      <h2 className="text-3xl font-bold  m-5">Sign-Up</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" bg-dark-2 p-7 rounded-md w-[600px] gap-5  max-sm:flex  max-sm:flex-col max-sm:p-7 max-sm:w-[93%] grid grid-cols-2"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className=" col-start-1 col-end-3">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Name"
                    className="bg-dark-3 text-light-2 border border-dark-4 "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className=" col-start-1 col-end-3">
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Address"
                    className="bg-dark-3 text-light-2 border border-dark-4  "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="appartment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Appartment</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Appartment"
                    className="bg-dark-3 text-light-2 border border-dark-4  "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your City"
                    className="bg-dark-3 text-light-2 border border-dark-4  "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your State"
                    className="bg-dark-3 text-light-2 border border-dark-4  "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ZIP"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your ZIP"
                    className="bg-dark-3 text-light-2 border border-dark-4  "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phNo"
            render={({ field }) => (
              <FormItem className=" col-start-1 col-end-3">
                <FormLabel>phNo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your phNo"
                    className="bg-dark-3 text-light-2 border border-dark-4  "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className=" col-start-1 col-end-3">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your Email"
                    className="bg-dark-3 text-light-2 border border-dark-4  "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className=" col-start-1 col-end-3">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    className="bg-dark-3 text-light-2 border border-dark-4  "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-1/4 mx-auto py-2 hover:bg-zinc-700  col-start-1 col-end-3"
          >
            SignUp
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserSignup;
