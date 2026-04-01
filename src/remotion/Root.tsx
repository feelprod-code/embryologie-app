import React from 'react';
import { Composition } from 'remotion';
import { IntroSequence } from './IntroSequence';
import { MainTrailerSecure } from './MainTrailerSecure';
import { MainTrailerHier } from './MainTrailerHier';
import { SequenceA } from './SequenceA';

import { MainTrailer_v1 } from './MainTrailer_v1';
import { MainTrailer_v2 } from './MainTrailer_v2';
import { MainTrailer_v3 } from './MainTrailer_v3';
import { MainTrailer_v4 } from './MainTrailer_v4';
import { MainTrailer_v5 } from './MainTrailer_v5';
import { MainTrailer_v6 } from './MainTrailer_v6';
import { MainTrailer_v7 } from './MainTrailer_v7';
import { MainTrailer_v8 } from './MainTrailer_v8';
import { MainTrailer_9_16 } from './MainTrailer_9_16';
import { MainTrailer_Carre } from './MainTrailer_Carre';
import { getTotalDurationFrames } from './config/timelineConfig';
import { SequenceK_v7 } from './SequenceK_v7';
import { SequenceA_v3 } from './SequenceA_v3';
import { SequenceB } from './SequenceB';
import { SequenceC } from './SequenceC';
import { SequenceD } from './SequenceD';
import { SequenceE } from './SequenceE';
import { SequenceF } from './SequenceF';
import { SequenceG } from './SequenceG';
import { SequenceH } from './SequenceH_v2';
import { SequenceI } from './SequenceI';
import { SequenceJ } from './SequenceJ';
import { SequenceK } from './SequenceK';
import { SequenceTutorial } from './SequenceTutorial';
import { TeaserIntroAndJ } from './TeaserIntroAndJ';
import './index.css';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TeaserIntroAndJ"
        component={TeaserIntroAndJ}
        durationInFrames={240+350+565+240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MainTrailer-V3-Fast"
        component={MainTrailer_v3}
        durationInFrames={213+150+240+141+168+420+120+240+540+420+300+600+300+240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MainTrailer-V4-60fps"
        component={MainTrailer_v4}
        durationInFrames={(213+77+147+141+168+420+120+240+540+420+300+600+300+240) * 2}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="MainTrailer-V5-60fps"
        component={MainTrailer_v5}
        durationInFrames={(213+77+147+141+168+420+120+240+540+420+300+600+300+240) * 2}
        fps={60}
        width={1920}
        height={1080}
      />
      <Composition
        id="0-IntroSequence"
        component={IntroSequence}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
                id="0-LeTrailerComplet-Sans-SequenceE"
                component={MainTrailerSecure}
                durationInFrames={350+400+400+306+1600+141+400} // Total sum manually
                fps={30}
                width={1920}
                height={1080}
            />
            <Composition
                id="MainTrailer-V6"
                component={MainTrailer_v6}
                durationInFrames={5200 * 2}
                fps={60}
                width={1920}
                height={1080}
            />
            <Composition
                id="MainTrailer-V7-Vertical"
                component={MainTrailer_v7}
                durationInFrames={5200 * 2}
                fps={60}
                width={1080}
                height={1920}
            />
            <Composition
                id="MainTrailer-Responsive-9-16"
                component={MainTrailer_9_16}
                durationInFrames={getTotalDurationFrames(60)}
                fps={60}
                width={1080}
                height={1920}
            />
            <Composition
                id="MainTrailer-Responsive-Carre"
                component={MainTrailer_Carre}
                durationInFrames={getTotalDurationFrames(60)}
                fps={60}
                width={1080}
                height={1080}
            />
            <Composition
                id="0-LeFilm-SeulementHier"
                component={MainTrailerHier}
                durationInFrames={350+400}
                fps={30}
                width={1920}
                height={1080}
            />
      <Composition
        id="1-SequenceA-v3"
        component={SequenceA_v3}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="1-SequenceA"
        component={SequenceA}
        durationInFrames={400}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="2-SequenceB"
        component={SequenceB}
        durationInFrames={400}
        fps={30}
        width={1920}
        height={1080}
      />


            <Composition
        id="3-SequenceC"
        component={SequenceC}
        durationInFrames={141}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="4-SequenceD"
        component={SequenceD}
        durationInFrames={168}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="5-SequenceE"
        component={SequenceE}
        durationInFrames={860}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="6-SequenceF"
        component={SequenceF}
        durationInFrames={141}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="7-SequenceG"
        component={SequenceG}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="7-SequenceG-60fps"
        component={SequenceG}
        durationInFrames={480}
        fps={60}
        width={1920}
        height={1080}
      />

      <Composition
        id="7-SequenceG-V7-60fps"
        component={SequenceG}
        durationInFrames={480}
        fps={60}
        width={1080}
        height={1920}
      />

      <Composition
        id="8-SequenceH"
        component={SequenceH}
        durationInFrames={540}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="9-SequenceI"
        component={SequenceI}
        durationInFrames={720}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="10-SequenceJ"
        component={SequenceJ}
        durationInFrames={565}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="10-SequenceJ-60fps"
        component={SequenceJ}
        durationInFrames={565 * 2}
        fps={60}
        width={1920}
        height={1080}
      />

      <Composition
        id="11-SequenceK"
        component={SequenceK}
        durationInFrames={3000}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="11-SequenceK-60fps"
        component={SequenceK}
        durationInFrames={6000}
        fps={60}
        width={1920}
        height={1080}
      />

      <Composition
        id="11-SequenceK-V7-Vertical"
        component={SequenceK_v7}
        durationInFrames={1100 * 2}
        fps={60}
        width={1080}
        height={1920}
      />

      <Composition
        id="Tutorial-Inscription-PWA"
        component={SequenceTutorial}
        durationInFrames={960}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="MainTrailer-V8-Carre"
        component={MainTrailer_v8}
        durationInFrames={(238 + 166 + 400 + 400 + 306 + 420 + 120 + 240 + 540 + 420 + 300 + 600 + 300 + 240) * 2}
        fps={60}
        width={1080}
        height={1080}
      />

      <Composition
        id="MainTrailer-V1"
        component={MainTrailer_v1}
        durationInFrames={8073}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="MainTrailer-V2"
        component={MainTrailer_v2}
        durationInFrames={4440}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
