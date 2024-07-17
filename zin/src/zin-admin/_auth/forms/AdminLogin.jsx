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
import { loginAdmin } from "@/zin-admin/lib/api/api";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const AdminSignUp = () => {
  const { toast } = useToast();

  const navigate = useNavigate();
  const { setIsAuthenticated } = useAdminAuth();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    const data = await loginAdmin(values);
    if (data.success) {
      localStorage.setItem("Cookie", data.authToken);
      navigate("/admin");
      toast({
        variant: "",
        title: "Log-in Successful!!",
      });
      form.reset();
      setIsAuthenticated(true);
    }else{
      toast({
        title: data.error
      })
    }
  }

  return (
    <div className="bg-dark-3 min-h-[670px] w-[530px] rounded-md flex items-center justify-start flex-col mt-[50px] py-14 max-sm:w-[310px] ">
      <img src="/icons/login.svg"/>

      <h2 className="text-3xl font-bold text-pink-200 m-5">Admin Log-In</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5 bg-dark-2 p-7 rounded-xl w-[450px] flex flex-col text-pink-200 max-sm:w-[280px] "
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
            className="w-1/4 mx-auto hover:bg-zinc-800 text-pink-200"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AdminSignUp;
