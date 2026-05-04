"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { FormInput } from "./FormInput"; // আপনার কম্পোনেন্ট

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(console.log)}>
        
        {/* এখানে control={form.control} দেওয়ামাত্র name-এ 'email' অটো-সাজেস্ট করবে */}
        <FormInput 
          control={form.control} 
          name="email" 
          label="Email" 
          placeholder="Enter email" 
        />

        <FormInput 
          control={form.control} 
          name="password" 
          label="Password" 
          type="password" 
          placeholder="******" 
        />

        <button type="submit">Login</button>
      </form>
    </Form>
  );
}