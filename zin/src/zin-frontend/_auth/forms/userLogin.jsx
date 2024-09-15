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
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/zin-admin/context/AdminAuthProvider";
import { loginAdmin, loginUser } from "@/lib/api/api";
import { useToast } from "@/components/ui/use-toast";
import { useUserAuth } from "@/zin-frontend/context/UserAuthProvider";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const UserLogin = () => {
  const { toast } = useToast();

  const navigate = useNavigate();
  const { setIsUserAuthenticated } = useUserAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    const data = await loginUser(values);
    if (data.success) {
      localStorage.setItem("UserCookie", data.authToken);
      navigate("/");
      toast({
        variant: "",
        title: "Log-in Successful!!",
      });
      form.reset();
      setIsUserAuthenticated(true);
    } else {
      toast({
        title: data.error,
      });
    }
  }

  return (
    <div className=" md:min-h-[80vh] min-h-[75vh] rounded-md flex  items-center justify-start flex-col mt-[50px] py-14 max-sm:w-full ">

      <h2 className="text-3xl font-bold  m-5">Admin Log-In</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 bg-dark-2 p-7 rounded-md w-[450px] flex flex-col  max-sm:w-[93%] "
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email"
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
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    className="bg-dark-3 text-light-2 border border-dark-4   "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-1/4 mx-auto py-2 hover:bg-zinc-800 "
          >
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserLogin;
