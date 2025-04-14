'use server';
/**
 * @fileOverview Generates a roll-call list from a video feed.
 *
 * - generateRollCall - A function that generates the roll-call list.
 * - GenerateRollCallInput - The input type for the generateRollCall function.
 * - GenerateRollCallOutput - The return type for the generateRollCall function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateRollCallInputSchema = z.object({
  videoFeed: z.string().describe('The URL of the video feed.'),
  knownAttendees: z.array(z.string()).describe('A list of known attendees.'),
});
export type GenerateRollCallInput = z.infer<typeof GenerateRollCallInputSchema>;

const GenerateRollCallOutputSchema = z.object({
  presentAttendees: z.array(z.string()).describe('A list of attendees identified as present in the video feed.'),
  absentAttendees: z.array(z.string()).describe('A list of attendees from knownAttendees not identified in the video feed.'),
  unidentifiedFaces: z.number().describe('The number of unidentified faces in the video feed.'),
});
export type GenerateRollCallOutput = z.infer<typeof GenerateRollCallOutputSchema>;

export async function generateRollCall(input: GenerateRollCallInput): Promise<GenerateRollCallOutput> {
  return generateRollCallFlow(input);
}

const generateRollCallPrompt = ai.definePrompt({
  name: 'generateRollCallPrompt',
  input: {
    schema: z.object({
      videoFeed: z.string().describe('The URL of the video feed.'),
      knownAttendees: z.array(z.string()).describe('A list of known attendees.'),
    }),
  },
  output: {
    schema: z.object({
      presentAttendees: z.array(z.string()).describe('A list of attendees identified as present in the video feed.'),
      absentAttendees: z.array(z.string()).describe('A list of attendees from knownAttendees not identified in the video feed.'),
      unidentifiedFaces: z.number().describe('The number of unidentified faces in the video feed.'),
    }),
  },
  prompt: `You are an AI assistant helping to generate a roll-call list from a video feed.

  Given the video feed: {{videoFeed}}
  And the list of known attendees: {{knownAttendees}}

  Identify the attendees present in the video feed and determine who is absent.
  Also, count the number of unidentified faces in the video feed.

  Return the list of present attendees, absent attendees, and the number of unidentified faces.  If you can't identify a face in the video feed, increment the 
unidentifiedFaces counter.
  Do not assume the name of the person if you are not confident.  
  If no one is in the video feed, return empty lists for presentAttendees and absentAttendees, and 0 for unidentifiedFaces.
  The attendees can be identified by facial recognition in the video feed.  Try to identify as many people as possible.
  The response should be a JSON object.
  `,
});

const generateRollCallFlow = ai.defineFlow<
  typeof GenerateRollCallInputSchema,
  typeof GenerateRollCallOutputSchema
>({
  name: 'generateRollCallFlow',
  inputSchema: GenerateRollCallInputSchema,
  outputSchema: GenerateRollCallOutputSchema,
}, async input => {
  const {output} = await generateRollCallPrompt(input);
  return output!;
});
