import { createStyles } from '@mantine/core'
import React, { FunctionComponent, useEffect, useState } from 'react'
import { PlayerPlay, PlayerPause } from 'tabler-icons-react'
import { motion } from 'framer-motion'
import { MediaItem } from '../../models/MediaItem';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectPlaying, setNowPlayingMedia, setPlaying } from '../../store/features/nowPlaying.slice';

const useStyles = createStyles(theme => ({
    wrapper: {
        backgroundColor: theme.colors.spotifyAccent[5],
        boxShadow: '0 8px 8px rgb(0 0 0 / 30%)'
    }
}));

const PlayButton: FunctionComponent<MediaItem> = ({ id, title, interpreter, img }) => {
    const dispatch = useAppDispatch();
    const { id: playingId, playing } = useAppSelector(selectPlaying);
    const { classes, cx } = useStyles();
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioContext, setAudioContext] = useState(null);
    const [audioBuffer, setAudioBuffer] = useState(null);
    const [audioSource, setAudioSource] = useState(null);
    
    const url = '/assets/audio.mp3'
    const fetchAudio = async (url) => {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const context = new AudioContext();
      const buffer = await context.decodeAudioData(arrayBuffer);
      setAudioContext(context);
      setAudioBuffer(buffer);
    };
  
    useEffect(() => {
      fetchAudio('/assets/audio.mp3');
    }, []);
  
    const play = () => {
      if (audioContext && audioBuffer && !isPlaying) {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0);
        setAudioSource(source);
        setIsPlaying(true);
      }
    };
  
    const stop = () => {
      if (audioSource) {
        audioSource.stop(0);
        setIsPlaying(false);
      }
    };

    const handleClick = () => {
        if (playingId === id) {
            dispatch(setPlaying(!playing))
            stop()
        } else {
            dispatch(setNowPlayingMedia({ id, title, interpreter, img }));
            play()
        }
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.3 } }}>
            <button
                className={
                    cx(
                        classes.wrapper,
                        'w-12 h-12 rounded-full flex justify-center items-center text-black hover:scale-105 cursor-default'
                    )
                }
                onClick={handleClick}
            >
                {playing && id === playingId ? (
                    <PlayerPause fill='#000' size={24} />
                ) : (
                    <PlayerPlay fill='#000' size={24} />
                )}
            </button>
        </motion.div>
    )
}

export default PlayButton