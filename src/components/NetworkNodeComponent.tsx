import { NodeProps } from '@nivo/network'
import {animated, to} from "@react-spring/web";
import { NetworkNode } from '../utils/interfaces';
import { DataModel } from '../DataModel';

function NetWorkNodeComponent(nodeIn: NodeProps<NetworkNode>, model: DataModel ){
    const  {
        node,
        animated: animatedProps,
        onClick,
        onMouseEnter,
        onMouseMove,
        onMouseLeave,
    } = nodeIn
    const artistImageUrl = model.getArtist(node.id).image_url || "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1114445501.jpg"

    return <>
        <defs>
        <clipPath id={`circle-clip-${node.id}`} clipPathUnits="objectBoundingBox">
            <circle cx="0.5" cy="0.5" r="0.5" />
        </clipPath>
        </defs>

        <animated.g
        transform={to(
            [animatedProps.x, animatedProps.y, animatedProps.scale],
            (x, y, scale) => `translate(${x},${y}) scale(${scale})`
        )}
        >
        <animated.image
            href={artistImageUrl}
            width={animatedProps.size}
            height={animatedProps.size}
            x={to(animatedProps.size, size => -size / 2)}
            y={to(animatedProps.size, size => -size / 2)}
            clipPath={`url(#circle-clip-${node.id})`}
            preserveAspectRatio="xMidYMid slice"
            opacity={animatedProps.opacity}
        />

        <animated.circle
            r={to([animatedProps.size], size => size / 2)}
            strokeWidth={animatedProps.borderWidth}
            stroke={animatedProps.borderColor}
            fill="transparent"
            onClick={onClick ? event => onClick(node, event) : undefined}
            onMouseEnter={onMouseEnter ? event => onMouseEnter(node, event) : undefined}
            onMouseMove={onMouseMove ? event => onMouseMove(node, event) : undefined}
            onMouseLeave={onMouseLeave ? event => onMouseLeave(node, event) : undefined}
            data-testid={`node.${node.id}`}
        />
        </animated.g>
    </>
}

export default NetWorkNodeComponent;