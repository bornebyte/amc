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
import { verifyUser } from "../../actions"
import { toast } from "sonner"

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    code: z.string().length(6, {
        message: "Verification code must be 6 digit long.",
    }),
})

const VerifyUserComponent = () => {
    const router = useRouter();
    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            code: ""
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values) {
        verifyUser(values.email, values.code)
            .then(data => {
                if (data.length === 1) {
                    // Redirect to dashboard or home page after successful login
                    // router.push('/dashboard'); // Adjust the path as needed
                    toast.success("Verification successful!");
                } else {
                    toast.error("Unable to verify user. Please check your code.");
                }
            })
            .catch(error => {
                console.error("Error during verifying user:", error);
            });
    }
    return (
        <div className="max-w-md mx-auto mt-10 px-4">
            <h1 className="text-2xl font-bold mb-6">Verify User</h1>
            <p className="mb-4 text-sm text-gray-600">
                Please enter your code to verify your account which is sent in your phone.
            </p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Please enter your email" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                    <Input placeholder="Please enter your code" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex flex-col gap-2">
                        <Button type="submit">Verify</Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default VerifyUserComponent;
