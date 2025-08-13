"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { registerUser } from "../actions"
import { toast } from "sonner"

const formSchema = z.object({
    username: z.string().min(4, {
        message: "Username must be at least 4 characters.",
    }),
    phone: z.string().min(10, {
        message: "Phone number must be 10 digit long.",
    }),
    email: z.email({
        message: "Invalid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters long.",
    }),
    confirmPassword: z.string().min(6, {
        message: "Confirm Password must be at least 6 characters long.",
    }),
    invitationCode: z.string().optional(),
})

const RegisterUserComponent = () => {
    const router = useRouter();
    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            phone: "",
            email: "",
            password: "",
            confirmPassword: "",
            invitationCode: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values) {
        if (values.password !== values.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        // Call the registerUser action with the form values
        if (!values.invitationCode) {
            values.invitationCode = null; // Set to null if no invitation code is provided
        }
        delete values.confirmPassword; // Remove confirmPassword from the data sent to the server
        // console.log("Form values:", values);
        // Call the registerUser function to register the user

        registerUser(values.username, values.phone, values.email, values.password, values.invitationCode)
            .then(data => {
                // console.log("User created successfully:", data);
                toast.success("User registered successfully!");
                router.push('/login'); // Redirect to login after successful registration
            })
            .catch(error => {
                toast.error("Error creating user. Please try again.");
                console.error("Error creating user:", error);
            });
    }
    return (
        <div className="max-w-md mx-auto mt-10 px-4">
            <h1 className="text-2xl font-bold mb-6">Register to AMC</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input type={"number"} placeholder="Please enter your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type={"email"} placeholder="Please enter your email" {...field} />
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
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type={"password"} placeholder="Please enter password again" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="invitationCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Invitation Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="Please enter invitation code" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col gap-2">
                        <Button type="submit">Register</Button>
                        <Button variant="secondary" type="button" onClick={() => router.push('/login')}>
                            Login
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default RegisterUserComponent;
