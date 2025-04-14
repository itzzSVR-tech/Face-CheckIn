"use client";

import React, { useState, useRef, useEffect } from 'react';
import { generateRollCall } from '@/ai/flows/generate-roll-call';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const AttendancePage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [knownAttendees, setKnownAttendees] = useState<string[]>([]);
  const [presentAttendees, setPresentAttendees] = useState<string[]>([]);
  const [absentAttendees, setAbsentAttendees] = useState<string[]>([]);
  const [unidentifiedFaces, setUnidentifiedFaces] = useState<number>(0);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [newAttendeeName, setNewAttendeeName] = useState('');

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsWebcamActive(true);
        }
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    if (isWebcamActive) {
      return;
    }

    startWebcam();
  }, [isWebcamActive]);

  const captureAttendance = async () => {
    if (!videoRef.current || !isWebcamActive) {
      alert("Webcam is not active. Please ensure the webcam is enabled.");
      return;
    }

    // Placeholder for capturing the video feed. Replace with actual implementation.
    const videoFeed = "placeholder_video_feed_url";

    try {
      const rollCallResult = await generateRollCall({
        videoFeed: videoFeed,
        knownAttendees: knownAttendees,
      });

      setPresentAttendees(rollCallResult.presentAttendees);
      setAbsentAttendees(rollCallResult.absentAttendees);
      setUnidentifiedFaces(rollCallResult.unidentifiedFaces);
    } catch (error) {
      console.error("Error generating roll call:", error);
      alert("Failed to generate roll call. Please try again.");
    }
  };

  const addAttendee = () => {
    if (newAttendeeName.trim() !== '') {
      setKnownAttendees([...knownAttendees, newAttendeeName.trim()]);
      setNewAttendeeName('');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-secondary p-4 gap-4">
      {/* Webcam and Controls Section */}
      <div className="md:w-1/2 flex flex-col gap-4">
        <Card className="shadow-md">
          <CardContent className="flex flex-col items-center p-4">
            <video ref={videoRef} className="w-full rounded-md" autoPlay muted />
            {!isWebcamActive && <p>Waiting for webcam access...</p>}
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button onClick={captureAttendance} className='text-xl bg-slate-400 hover:bg-slate-600' disabled={!isWebcamActive}>
            Capture Attendance
          </Button>
        </div>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <Label htmlFor="newAttendee" className="text-2xl">Add New Attendee</Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="newAttendee"
                type="text"
                placeholder="Attendee Name"
                value={newAttendeeName}
                onChange={(e) => setNewAttendeeName(e.target.value)}
                className='border-indigo-400 border-2 border-spacing-0'
              />
              <Button onClick={addAttendee} className='text-xl bg-slate-400 hover:bg-slate-600'>Add</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Reporting Section */}
      <div className="md:w-1/2 flex flex-col gap-4">
        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-3xl font-semibold">Attendance Report</h2>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Present Attendees</h3>
              <ul className="list-disc list-inside">
                {presentAttendees.map((attendee, index) => (
                  <li key={index}>{attendee}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Absent Attendees</h3>
              <ul className="list-disc list-inside">
                {absentAttendees.map((attendee, index) => (
                  <li key={index}>{attendee}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Unidentified Faces</h3>
              <p>{unidentifiedFaces}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <h2 className="text-3xl font-semibold">Known Attendees</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {knownAttendees.map((attendee, index) => (
                <li key={index}>
                  <Avatar>
                    <AvatarImage src={`https://picsum.photos/id/${index + 10}/50/50`} alt={attendee} />
                    <AvatarFallback>{attendee.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2">{attendee}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendancePage;
