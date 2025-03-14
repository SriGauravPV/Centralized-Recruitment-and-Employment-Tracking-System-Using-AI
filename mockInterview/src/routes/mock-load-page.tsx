import { db } from "@/config/firebase.config";
import { Interview } from "@/types";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LoaderPage } from "./loader-page";
import { CustomBreadCrumb } from "@/components/custom-bread-crumb";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles, WebcamIcon } from "lucide-react";
import { InterviewPin } from "@/components/pin";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WebCam from "react-webcam";

export const MockLoadPage = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWebCamEnabled, setIsWebCamEnabled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchInterview = async () => {
      if (interviewId) {
        try {
          const interviewDoc = await getDoc(doc(db, "interviews", interviewId));
          if (interviewDoc.exists()) {
            setInterview({
              id: interviewDoc.id,
              ...interviewDoc.data(),
            } as Interview);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchInterview();
  }, [interviewId, navigate]);

  if (isLoading) {
    return <LoaderPage className="w-full h-[80vh]" />;
  }

  if (!interviewId || !interview) {
    navigate("/generate", { replace: true });
    return null;
  }

  return (
    <div className="flex flex-col h-[80vh] max-w-6xl mx-auto w-full px-4">
      {/* Header Section - 15% height */}
      <div className="flex-none h-[15%] flex items-center justify-between">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full justify-between">
          <CustomBreadCrumb
            breadCrumbPage={interview.position}
            breadCrumpItems={[{ label: "Mock Interviews", link: "/generate" }]}
          />

          <Link to={`/generate/interview/${interviewId}/start`}>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              Start Interview
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Content Section - 70% height */}
      <div className="flex-1 flex gap-4">
        {/* Left Side - Interview Pin and Alert */}
        <div className="flex-1 flex flex-col gap-4">
          {interview && <InterviewPin interview={interview} onMockPage />}

          <Alert className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-400 shadow-md">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-yellow-600 mt-1 flex-shrink-0" />
              <div className="space-y-2">
                <AlertTitle className="text-yellow-800 font-semibold text-lg">
                  Important Information
                </AlertTitle>
                <AlertDescription className="text-yellow-700 leading-relaxed">
                  Please enable your webcam and microphone to start the AI-generated
                  mock interview. The interview consists of five questions. You'll
                  receive a personalized report based on your responses at the end.
                  <div className="mt-3 p-2 bg-white/50 rounded-lg inline-block">
                    <span className="font-medium">Note:</span> Your video is{" "}
                    <strong>never recorded</strong>. You can disable your webcam at any time.
                  </div>
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </div>

        {/* Right Side - Webcam */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <div className="w-full h-full bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-lg overflow-hidden">
            {isWebCamEnabled ? (
              <WebCam
                onUserMedia={() => setIsWebCamEnabled(true)}
                onUserMediaError={() => setIsWebCamEnabled(false)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                <WebcamIcon className="h-24 w-24 text-gray-400" />
                <p className="mt-4 text-gray-500 text-sm">Camera is disabled</p>
              </div>
            )}
          </div>
          
          <Button
            onClick={() => setIsWebCamEnabled(!isWebCamEnabled)}
            className={`${
              isWebCamEnabled
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            } text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200`}
          >
            {isWebCamEnabled ? "Disable Webcam" : "Enable Webcam"}
          </Button>
        </div>
      </div>

      {/* Footer Section - 15% height */}
      <div className="flex-none h-[15%]" />
    </div>
  );
};

export default MockLoadPage;