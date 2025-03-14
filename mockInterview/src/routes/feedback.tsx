import { db } from "@/config/firebase.config";
import { Interview, UserAnswer } from "@/types";
import { useAuth } from "@clerk/clerk-react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { LoaderPage } from "./loader-page";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { Headings } from "@/components/headings";
import { InterviewPin } from "@/components/pin";
import { cn } from "@/lib/utils";
import { CircleCheck, Star } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Feedback = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState<UserAnswer[]>([]);
  const { userId } = useAuth();
  const navigate = useNavigate();

  if (!interviewId) {
    navigate("/generate", { replace: true });
  }

  useEffect(() => {
    if (interviewId) {
      const fetchInterview = async () => {
        if (interviewId) {
          try {
            const interviewDoc = await getDoc(
              doc(db, "interviews", interviewId)
            );
            if (interviewDoc.exists()) {
              setInterview({
                id: interviewDoc.id,
                ...interviewDoc.data(),
              } as Interview);
            }
          } catch (error) {
            console.log(error);
          }
        }
      };

      const fetchFeedbacks = async () => {
        setIsLoading(true);
        try {
          const querSanpRef = query(
            collection(db, "userAnswers"),
            where("userId", "==", userId),
            where("mockIdRef", "==", interviewId)
          );

          const querySnap = await getDocs(querSanpRef);

          const interviewData: UserAnswer[] = querySnap.docs.map((doc) => {
            return { id: doc.id, ...doc.data() } as UserAnswer;
          });

          setFeedbacks(interviewData);
        } catch (error) {
          console.log(error);
          toast("Error", {
            description: "Something went wrong. Please try again later..",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchInterview();
      fetchFeedbacks();
    }
  }, [interviewId, navigate, userId]);

  //   calculate the ratings out of 10
  const overAllRating = useMemo(() => {
    if (feedbacks.length === 0) return "0.0";

    const totalRatings = feedbacks.reduce(
      (acc, feedback) => acc + feedback.rating,
      0
    );

    return (totalRatings / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  if (isLoading) {
    return <LoaderPage className="container mx-auto h-96" />;
  }

  return (
    <div className="container mx-auto my-8 space-y-10">
      <div className="flex justify-between items-center mb-6">
        <CustomBreadCrumb
          breadCrumbPage={"Feedback"}
          breadCrumpItems={[
            { label: "Mock Interviews", link: "/generate" },
            {
              label: `${interview?.position}`,
              link: `/generate/interview/${interview?.id}`,
            },
          ]}
        />
      </div>

      <Headings
        title="Congratulations!"
        description="Your personalized feedback is now available. Dive in to see your strengths, areas for improvement, and tips to help you ace your next interview."
      />

      <p className="italic text-neutral-600">
        Overall performance:{" "}
        <span className="non-italic font-mono text-xl text-blue-700">
          {overAllRating} / 10
        </span>
      </p>
          <div style={{ width:"30%"}}>
      {interview && <InterviewPin interview={interview} onMockPage />}
      </div>

      <Headings title="Interview Feedback" isSubHeading />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbacks.map((feed) => (
          <Card key={feed.id} className="h-full border border-gray-200 flex flex-col">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="font-mono text-base">{feed.question}</CardTitle>
                <div className="flex items-center">
                  <Star className="text-orange-400 h-5 w-5 mr-2" />
                  <span className="font-mono font-medium">{feed.rating}/10</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 flex-grow">
              <div className="space-y-4">
                <div className="bg-cyan-50 border-l-4 border-l-cyan-600 p-4 rounded">
                  <h4 className="flex items-center text-cyan-800 mb-2 text-sm font-semibold">
                    <CircleCheck className="h-4 w-4 mr-2" />
                    <span className="uppercase tracking-wide">Expected Response</span>
                  </h4>
                  <p className="text-sm text-black">{feed.correct_ans}</p>
                </div>

                <div className="bg-violet-50 border-l-4 border-l-violet-600 p-4 rounded">
                  <h4 className="flex items-center text-violet-800 mb-2 text-sm font-semibold">
                    <CircleCheck className="h-4 w-4 mr-2" />
                    <span className="uppercase tracking-wide">Your Response</span>
                  </h4>
                  <p className="text-sm text-black">{feed.user_ans}</p>
                </div>

                <div className="bg-orange-50 border-l-4 border-l-orange-600 p-4 rounded">
                  <h4 className="flex items-center text-orange-800 mb-2 text-sm font-semibold">
                    <CircleCheck className="h-4 w-4 mr-2" />
                    <span className="uppercase tracking-wide">Assessment</span>
                  </h4>
                  <p className="text-sm text-black">{feed.feedback}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};