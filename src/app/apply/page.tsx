"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { RocketIcon, Loader2 } from "lucide-react";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  batchName: z.string().min(2, "Batch name must be at least 2 characters"),
  year: z.string(),
  interests: z.array(z.string()).min(1, "Please select at least one interest"),
  whyJoin: z.string().min(50, "Please write at least 50 characters"),
});

const interests = [
  "Artificial Intelligence",
  "Robotics",
  "Internet of Things",
  "Embedded Systems",
  "Computer Vision",
  "Machine Learning",
  "Automation",
  "Control Systems",
];

export default function ApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      batchName: "",
      year: "",
      interests: [],
      whyJoin: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/club/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      console.log(values);
      

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }

      toast.success("Application submitted successfully!");
      form.reset();
      setSelectedInterests([]);
    } catch (error) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
    form.setValue("interests", selectedInterests);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-background/80 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="backdrop-blur-xl bg-background/60 border-muted/20 shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mx-auto"
            >
              <RocketIcon className="h-12 w-12 text-primary mb-2" />
            </motion.div>
            <CardTitle className="text-3xl font-bold">Join RISC Robotics</CardTitle>
            <CardDescription className="text-muted-foreground">
              Apply to be part of the most innovative robotics club
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="batchName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your batch name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["1st", "2nd", "3rd", "4th"].map((year) => (
                            <SelectItem key={year} value={year}>
                              {year} Year
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interests"
                  render={() => (
                    <FormItem>
                      <FormLabel>Interests</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {interests.map((interest) => (
                          <Button
                            key={interest}
                            type="button"
                            variant={selectedInterests.includes(interest) ? "default" : "outline"}
                            className="h-auto py-2 px-3 text-sm"
                            onClick={() => toggleInterest(interest)}
                          >
                            {interest}
                          </Button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whyJoin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why do you want to join?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us why you're interested in joining RISC Robotics..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}