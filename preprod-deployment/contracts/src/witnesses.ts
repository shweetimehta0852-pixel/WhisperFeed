import { Ledger } from "./managed/bboard/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/midnight-js-protocol/compact-runtime";

export type WhisperFeedPrivateState = {
  readonly participantSk: Uint8Array;
  readonly surveyAuthToken: Uint8Array;
  readonly confidentialScore: number;
  readonly feedbackPayloadHash: Uint8Array;
  readonly organizerSecret: Uint8Array;
};

export const createWhisperFeedPrivateState = (
  participantSk: Uint8Array = new Uint8Array(32),
  surveyAuthToken: Uint8Array = new Uint8Array(32),
  confidentialScore: number = 10,
  feedbackPayloadHash: Uint8Array = new Uint8Array(32),
  organizerSecret: Uint8Array = new Uint8Array(32)
): WhisperFeedPrivateState => ({
  participantSk,
  surveyAuthToken,
  confidentialScore,
  feedbackPayloadHash,
  organizerSecret,
});

export const witnesses = {
  get_submission_witness: ({
    privateState,
  }: WitnessContext<Ledger, WhisperFeedPrivateState>): [
    WhisperFeedPrivateState,
    {
      participant_sk: Uint8Array;
      survey_auth_token: Uint8Array;
      confidential_score: number;
      feedback_payload_hash: Uint8Array;
    }
  ] => [
    privateState,
    {
      participant_sk: privateState.participantSk,
      survey_auth_token: privateState.surveyAuthToken,
      confidential_score: privateState.confidentialScore,
      feedback_payload_hash: privateState.feedbackPayloadHash,
    },
  ],

  get_organizer_secret: ({
    privateState,
  }: WitnessContext<Ledger, WhisperFeedPrivateState>): [
    WhisperFeedPrivateState,
    Uint8Array
  ] => [privateState, privateState.organizerSecret],
};
