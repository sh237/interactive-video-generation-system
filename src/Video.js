import React, { useRef, useEffect } from 'react'

export function Video() {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        videoRef.current?.play();
    }, []);
    
    return (
        <React.StrictMode>
                    <video controls muted ref={videoRef} >
                        <source src={process.env.PUBLIC_URL + '/sample.mp4'} type="video/mp4" />
                        <p>Your browser doesn't support HTML5 video.</p>
                    </video>
        </React.StrictMode>
    );
}