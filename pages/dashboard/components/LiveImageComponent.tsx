import React from 'react';
interface ImageIF {
    url: string;
    props?: React.ImgHTMLAttributes<HTMLImageElement> | undefined;
}
const LiveImageComponent: React.FC<ImageIF> = ({ url, props }) => {
    return (
        <div className="flex items-center justify-center">
            <img
                {...props}
                className="rounded-full m-2 w-12 h-12 object-cover"
                width={48}
                height={48}
                src={url}
                alt={`Staff profile picture`}
                onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://backend.skooltym.com/uploads/default.png';
                }}
            />
        </div>
    );
};

export default LiveImageComponent;