"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { loginUsers } from "../actions"
import { toast } from "sonner"

const formSchema = z.object({
    phone: z.string().length(10, {
        message: "Phone number must be 10 digit long.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long.",
    }),
})

const LoginUserComponent = () => {
    const router = useRouter();
    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            phone: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values) {
        loginUsers(values.phone, values.password)
            .then(data => {
                if (data.length > 0) {
                    // Redirect to dashboard or home page after successful login
                    // router.push('/dashboard'); // Adjust the path as needed
                    toast.success("Login successful!");
                } else {
                    toast.error("Invalid login credentials");
                }
            })
            .catch(error => {
                console.error("Error during login:", error);
            });
    }
    return (
        <div className="max-w-md mx-auto mt-10 px-4">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input placeholder="Please enter your phone number" {...field} />
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
                                    <Input type={"password"} placeholder="Please enter password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col gap-2">
                        <Button type="submit">Login</Button>
                        <Button variant="secondary" type="button" onClick={() => router.push('/register')}>
                            Register
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default LoginUserComponent;
