import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { Interview } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { toast } from "sonner";
import { Headings } from "./headings";
import { Button } from "./ui/button";
import { Loader, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { chatSession } from "@/scripts";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase.config";
import { CustomBreadCrumb } from "./custom-bread-crumb";
import { zodResolver } from "@hookform/resolvers/zod";

interface FormMockInterviewProps {
  initialData: Interview | null;
}

const formSchema = z.object({
  position: z
    .string()
    .min(1, "Position is required")
    .max(100, "Position must be 100 characters or less"),
  description: z.string().min(10, "Description is required"),
  experience: z.coerce
    .number()
    .min(0, "Experience cannot be empty or negative"),
  techStack: z.string().min(1, "Tech stack must be at least a character"),
});

type FormData = z.infer<typeof formSchema>;

interface QuestionAnswer {
  question: string;
  answer: string;
}

export const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {},
  });

  const { isValid, isSubmitting } = form.formState;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { userId } = useAuth();

  const title = initialData ? initialData.position : "Create a new mock interview";
  const breadCrumpPage = initialData ? initialData?.position : "Create";
  const actions = initialData ? "Save Changes" : "Create";
  const toastMessage = initialData
    ? { title: "Updated!", description: "Changes saved successfully..." }
    : { title: "Created!", description: "New Mock Interview created..." };

  const cleanAiResponse = (responseText: string): QuestionAnswer[] => {
    try {
      // Step 1: Remove any markdown code block syntax
      let cleanText = responseText.replace(/```json\n?|```\n?/g, '');
      
      // Step 2: Try to find a JSON array in the text
      const match = cleanText.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (!match) {
        throw new Error("No valid JSON array found in response");
      }
      
      // Step 3: Parse the JSON
      const parsed = JSON.parse(match[0]) as QuestionAnswer[];
      
      // Step 4: Validate the structure
      if (!Array.isArray(parsed)) {
        throw new Error("Response is not an array");
      }
      
      // Step 5: Validate each item has required properties
      const validatedArray = parsed.map((item, index) => {
        if (!item.question || !item.answer) {
          throw new Error(`Item at index ${index} is missing required properties`);
        }
        return {
          question: item.question.trim(),
          answer: item.answer.trim()
        };
      });

      return validatedArray;
    } catch (error) {
      console.error("Error parsing AI response:", error);
      throw new Error(`Failed to parse AI response: ${(error as Error).message}`);
    }
  };

  const generateAiResponse = async (data: FormData): Promise<QuestionAnswer[]> => {
    try {
      const prompt = `
        Generate a JSON array of 5 technical interview questions with answers based on:
        - Position: ${data.position}
        - Description: ${data.description}
        - Experience: ${data.experience} years
        - Tech Stack: ${data.techStack}

        Format strictly as:
        [
          {
            "question": "Technical question here",
            "answer": "Detailed answer here"
          }
        ]

        Questions should cover ${data.techStack} development, best practices, and problem-solving.
        Return ONLY the JSON array, no additional text.`;

      const aiResult = await chatSession.sendMessage(prompt);
      return cleanAiResponse(aiResult.response.text());
    } catch (error) {
      console.error("Error generating AI response:", error);
      throw new Error("Failed to generate interview questions. Please try again.");
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      if (!isValid) {
        throw new Error("Please fill all required fields correctly");
      }

      const aiResult = await generateAiResponse(data);

      if (initialData) {
        await updateDoc(doc(db, "interviews", initialData.id), {
          questions: aiResult,
          ...data,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "interviews"), {
          ...data,
          userId,
          questions: aiResult,
          createdAt: serverTimestamp(),
        });
      }

      toast(toastMessage.title, { description: toastMessage.description });
      navigate("/generate", { replace: true });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Error", {
        description: (error as Error).message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      form.reset({
        position: initialData.position,
        description: initialData.description,
        experience: initialData.experience,
        techStack: initialData.techStack,
      });
    }
  }, [initialData, form]);

  return (
    <div className="w-full flex-col space-y-4">
      <CustomBreadCrumb
        breadCrumbPage={breadCrumpPage}
        breadCrumpItems={[{ label: "Mock Interviews", link: "/generate" }]}
      />

      <div className="mt-4 flex items-center justify-between w-full">
        <Headings title={title} isSubHeading />

        {initialData && (
          <Button size="icon" variant="ghost">
            <Trash2 className="min-w-4 min-h-4 text-red-500" />
          </Button>
        )}
      </div>

      <Separator className="my-4" />

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full p-8 rounded-lg flex-col flex items-start justify-start gap-6 shadow-md"
        >
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Role / Job Position</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- Full Stack Developer"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Job Description</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- describe your job role"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Years of Experience</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Input
                    type="number"
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- 5 Years"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="techStack"
            render={({ field }) => (
              <FormItem className="w-full space-y-4">
                <div className="w-full flex items-center justify-between">
                  <FormLabel>Tech Stacks</FormLabel>
                  <FormMessage className="text-sm" />
                </div>
                <FormControl>
                  <Textarea
                    className="h-12"
                    disabled={loading}
                    placeholder="eg:- React, TypeScript..."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="w-full flex items-center justify-end gap-6">
            <Button
              type="reset"
              size="sm"
              variant="outline"
              disabled={isSubmitting || loading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || !isValid || loading}
            >
              {loading ? (
                <Loader className="text-gray-50 animate-spin" />
              ) : (
                actions
              )}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};