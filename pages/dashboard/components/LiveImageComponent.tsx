import React from 'react';
interface ImageIF {
    url: string;
}
const LiveImageComponent: React.FC<ImageIF> = ({ url }) => {
    return (
        <div className="flex items-center justify-center">
            <img
                className="rounded-full m-2 w-12 h-12 object-cover"
                width={48}
                height={48}
                src={url ?? 'https://placehold.co/500x500'}
                alt={`Staff profile picture`}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/500x500';
                }}
            />
        </div>
    );
};

export default LiveImageComponent;